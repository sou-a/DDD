import { PrismaClient } from '@prisma/client'
import { IUserRepository } from 'src/domain/entity/user/i-user-repository'
import { User } from 'src/domain/entity/user/user'

export class UserRepository implements IUserRepository {
  private prismaClient: PrismaClient

  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient
  }

  public async findAll(): Promise<User[]> {
    const models = await this.prismaClient.user.findMany()
    const entity: User[] = models.map(
      (model): User => {
        return new User({
          id: model.id,
          name: model.name,
          mailAddress: model.mailAddress,
          status: model.userStatusId,
        })
      },
    )
    return entity
  }

  public async findById(userId: string): Promise<User> {
    const userModel = await this.prismaClient.user.findUnique({
      where: {
        id: userId,
      },
    })
    if (userModel === null) {
      throw new Error(`${userId}が見つかりませんでした`)
    }

    const userStatusModel = await this.prismaClient.userStatus.findUnique({
      where: {
        id: userId,
      },
    })
    if (userStatusModel === null) {
      throw new Error('ステータスが見つかりませんでした')
    }

    const entity = new User({
      id: userModel.id,
      name: userModel.name,
      mailAddress: userModel.mailAddress,
      status: userStatusModel.name,
    })
    return entity
  }

  public async save(user: User): Promise<User> {
    const { id, name, mailAddress, status } = user.getAllProperties()

    // TODO: findUnique
    const userStatusModel = await this.prismaClient.userStatus.findFirst({
      where: {
        name: status,
      },
    })
    if (userStatusModel === null) {
      throw new Error('ステータスが見つかりませんでした')
    }

    const savedUsermodel = await this.prismaClient.user.create({
      data: {
        id,
        name,
        mailAddress,
        userStatusId: userStatusModel.id,
      },
    })
    const savedUserEntity = new User({
      id: savedUsermodel.id,
      name: savedUsermodel.name,
      mailAddress: savedUsermodel.mailAddress,
      status: userStatusModel.name,
    })
    return savedUserEntity
  }

  public async delete(userId: string): Promise<void> {
    await this.prismaClient.user.delete({
      where: {
        id: userId,
      },
    })
  }
}
