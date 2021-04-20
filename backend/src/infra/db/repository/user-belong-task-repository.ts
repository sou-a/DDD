import { PrismaClient } from '@prisma/client'
import { IUserBelongTaskRepository } from 'src/domain/entity/user-belong-task/i-user-belong-task-repository'
import { UserBelongTask } from 'src/domain/entity/user-belong-task/user-belong-task'

export class UserBelongTaskRepository implements IUserBelongTaskRepository {
  private prismaClient: PrismaClient

  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient
  }

  public async findAll(): Promise<UserBelongTask[]> {
    const models = await this.prismaClient.taskUser.findMany()
    const entities: UserBelongTask[] = models.map(
      (model): UserBelongTask => {
        return new UserBelongTask({
          userId: model.userId,
          taskId: model.taskId,
          status: model.taskUserStatusId,
        })
      },
    )
    return entities
  }

  public async findByUserId(userId: string): Promise<UserBelongTask[]> {
    const models = await this.prismaClient.taskUser.findMany({
      where: {
        userId: userId,
      },
      include: {
        task: true,
      },
    })
    if (models === null) {
      throw new Error(`${userId}が見つかりませんでした`)
    }

    const entities = models.map((model) => {
      return new UserBelongTask({
        userId: model.userId,
        taskId: model.taskId,
        status: model.taskUserStatusId,
      })
    })
    return entities // TODO: id渡されても不便じゃない？（taskを渡して欲しいことが多いはず）→クエリサービスを使う...？
  }

  public async save(UserBelongtask: UserBelongTask): Promise<UserBelongTask> {
    const { userId, taskId, status } = UserBelongtask.getAllProperties()

    const model = await this.prismaClient.taskUser.create({
      data: {
        userId,
        taskId,
        taskUserStatusId: status,
      },
    })
    const entity = new UserBelongTask({
      userId: model.userId,
      taskId: model.taskId,
      status: model.taskUserStatusId,
    })
    return entity
  }

  public async deleteByTaskId(taskId: string): Promise<void> {
    await this.prismaClient.taskUser.deleteMany({
      where: {
        taskId,
      },
    })
  }

  public async deleteByUserId(userId: string): Promise<void> {
    await this.prismaClient.taskUser.deleteMany({
      where: {
        userId,
      },
    })
  }
}
