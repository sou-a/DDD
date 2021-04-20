import { PrismaClient } from '@prisma/client'
import { IPairRepository } from 'src/domain/entity/pair/i-pair-repository'
import { Pair } from 'src/domain/entity/pair/pair'
import { PairUser } from 'src/domain/entity/pair/pair-user'
import { User } from 'src/domain/entity/user/user'

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
            user: true,
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
            status: pairUser.user.userStatusId,
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
            user: true,
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
        status: pairUser.user.userStatusId,
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

    const model = await this.prismaClient.pair.create({
      data: {
        id,
        name,
        users: {
          create: pairUsers.map((pairUser: PairUser) => {
            return pairUser.getAllProperties()
          }),
        },
      },
      include: {
        users: {
          include: {
            user: true,
          },
        },
      },
    })

    const userEntity = model.users.map((pairUser) => {
      return new User({
        id: pairUser.user.id,
        name: pairUser.user.name,
        mailAddress: pairUser.user.mailAddress,
        status: pairUser.user.name,
      })
    })
    const entity = new Pair({
      id: model.id,
      name: model.name,
      users: userEntity,
    })
    return entity
  }

  public async delete(pairId: string): Promise<void> {
    await this.prismaClient.pair.delete({
      where: {
        id: pairId,
      },
    })
  }
}
