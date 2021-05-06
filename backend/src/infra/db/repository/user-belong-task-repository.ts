import { PrismaClient } from '@prisma/client'
import { IUserBelongTaskRepository } from 'src/domain/entity/user-belong-task/i-user-belong-task-repository'
import { UserBelongTask } from 'src/domain/entity/user-belong-task/user-belong-task'
import { TaskStatus } from 'src/domain/valueOblect/task-status'

export class UserBelongTaskRepository implements IUserBelongTaskRepository {
  private prismaClient: PrismaClient

  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient
  }

  public async findAll(): Promise<UserBelongTask[]> {
    const models = await this.prismaClient.taskUser.findMany({
      include: {
        taskUserStatus: true,
      },
    })
    const entities: UserBelongTask[] = models.map(
      (model): UserBelongTask => {
        return new UserBelongTask({
          userId: model.userId,
          taskId: model.taskId,
          status: new TaskStatus(model.taskUserStatus.name),
        })
      },
    )
    return entities
  }

  public async findByUserIdAndTaskId(
    userId: string,
    taskId: string,
  ): Promise<UserBelongTask> {
    // TODO: Unique
    const model = await this.prismaClient.taskUser.findFirst({
      where: {
        userId,
        taskId,
      },
      include: {
        task: true,
        taskUserStatus: true,
      },
    })
    if (model === null) {
      throw new Error(`${userId}が見つかりませんでした`)
    }

    return new UserBelongTask({
      userId: model.userId,
      taskId: model.taskId,
      status: new TaskStatus(model.taskUserStatus.name),
    })
  }

  public async findByUserId(userId: string): Promise<UserBelongTask[]> {
    const models = await this.prismaClient.taskUser.findMany({
      where: {
        userId,
      },
      include: {
        task: true,
        taskUserStatus: true,
      },
    })
    if (models === null) {
      throw new Error(`${userId}が見つかりませんでした`)
    }

    const entities = models.map((model) => {
      return new UserBelongTask({
        userId: model.userId,
        taskId: model.taskId,
        status: new TaskStatus(model.taskUserStatus.name),
      })
    })
    return entities // TODO: id渡されても不便じゃない？（taskを渡して欲しいことが多いはず）→クエリサービスを使う...？
  }

  public async save(UserBelongtask: UserBelongTask): Promise<UserBelongTask> {
    const { userId, taskId, status } = UserBelongtask.getAllProperties()
    const taskUserStatusmodel = await this.prismaClient.taskUserStatus.findFirst(
      {
        where: {
          name: status.getStatus(),
        },
      },
    )
    if (!taskUserStatusmodel) {
      throw new Error(`${status.getStatus()}が見つかりませんでした`)
    }
    const model = await this.prismaClient.taskUser.create({
      data: {
        userId,
        taskId,
        taskUserStatusId: taskUserStatusmodel.id,
      },
      include: {
        taskUserStatus: true,
      },
    })
    const entity = new UserBelongTask({
      userId: model.userId,
      taskId: model.taskId,
      status: new TaskStatus(model.taskUserStatus.name),
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
