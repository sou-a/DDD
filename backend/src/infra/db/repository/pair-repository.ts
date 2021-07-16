import { PrismaClient } from '@prisma/client'
import { IPairRepository } from 'src/domain/pair/i-pair-repository'
import { Pair } from 'src/domain/pair/pair'
import { User } from 'src/domain/user/user'
import { UserStatus } from 'src/domain/user/user-status'

export class PairRepository implements IPairRepository {
  private prismaClient: PrismaClient

  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient
  }

  public async findAll(): Promise<Pair[]> {
    const models = await this.prismaClient.pair.findMany({
      include: {
        users: {
          include: {
            user: {
              include: {
                userStatus: true,
              },
            },
          },
        },
      },
    })
    const entities: Pair[] = models.map(
      (model): Pair => {
        const users = model.users.map((pairUser) => {
          return new User({
            id: pairUser.user.id,
            name: pairUser.user.name,
            mailAddress: pairUser.user.mailAddress,
            status: new UserStatus(pairUser.user.userStatus.name),
          })
        })
        return new Pair({
          id: model.id,
          name: model.name,
          users: users,
        })
      },
    )
    return entities
  }

  public async findById(pairId: string): Promise<Pair> {
    const model = await this.prismaClient.pair.findUnique({
      where: {
        id: pairId,
      },
      include: {
        users: {
          include: {
            user: {
              include: {
                userStatus: true,
              },
            },
          },
        },
      },
    })
    if (model === null) {
      throw new Error(`${pairId}が見つかりませんでした`)
    }

    const users = model.users.map((pairUser) => {
      return new User({
        id: pairUser.user.id,
        name: pairUser.user.name,
        mailAddress: pairUser.user.mailAddress,
        status: new UserStatus(pairUser.user.userStatus.name),
      })
    })

    const entity = new Pair({
      id: model.id,
      name: model.name,
      users: users,
    })
    return entity
  }

  public async findByUserId(userId: string): Promise<Pair | null> {
    // findUniqueで探したい...
    const model = await this.prismaClient.pair.findFirst({
      where: {
        users: {
          some: {
            userId,
          },
        },
      },
      include: {
        users: {
          include: {
            user: {
              include: {
                userStatus: true,
              },
            },
          },
        },
      },
    })
    if (model === null) {
      return model
    }

    const users = model.users.map((pairUser) => {
      return new User({
        id: pairUser.user.id,
        name: pairUser.user.name,
        mailAddress: pairUser.user.mailAddress,
        status: new UserStatus(pairUser.user.userStatus.name),
      })
    })

    const entity = new Pair({
      id: model.id,
      name: model.name,
      users: users,
    })
    return entity
  }

  public async save(pair: Pair): Promise<Pair> {
    const { id, name, pairUsers } = pair.getAllProperties()

    const model = await this.prismaClient.pair.upsert({
      where: {
        id,
      },
      update: {
        name,
        users: {
          // ペアユーザー（子集約）全削除してcreateし直している（増減に対応するため）
          // @see https://github.com/little-hands/ddd-q-and-a/issues/129
          deleteMany: {},
          create: pairUsers.map((pairUser) => {
            return {
              userId: pairUser.getAllProperties().userId,
            }
          }),
        },
      },
      create: {
        id,
        name,
        users: {
          create: pairUsers.map((pairUser) => {
            return {
              userId: pairUser.getAllProperties().userId,
            }
          }),
        },
      },
      include: {
        users: {
          include: {
            user: {
              include: {
                userStatus: true,
              },
            },
          },
        },
      },
    })

    const userEntity = model.users.map((pairUser) => {
      return new User({
        id: pairUser.user.id,
        name: pairUser.user.name,
        mailAddress: pairUser.user.mailAddress,
        status: new UserStatus(pairUser.user.userStatus.name),
      })
    })
    const entity = new Pair({
      id: model.id,
      name: model.name,
      users: userEntity,
    })
    return entity
  }

  public async delete(pairId: string): Promise<boolean> {
    // 関連するテーブル（ペアユーザー）を削除
    await this.prismaClient.pair.update({
      where: {
        id: pairId,
      },
      data: {
        users: {
          deleteMany: {},
        },
      },
    })
    await this.prismaClient.pair.delete({
      where: {
        id: pairId,
      },
    })
    return true
  }

  public async deletePairUser(userId: string): Promise<void> {
    await this.prismaClient.pairUser.delete({
      where: {
        userId,
      },
    })
  }
}
