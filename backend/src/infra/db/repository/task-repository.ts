import { PrismaClient } from '@prisma/client'
import { ITaskRepository } from 'src/domain/task/i-task-repository'
import { Task } from 'src/domain/task/task'

export class TaskRepository implements ITaskRepository {
  private prismaClient: PrismaClient

  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient
  }

  public async findAll(): Promise<Task[]> {
    const models = await this.prismaClient.task.findMany()
    const entities: Task[] = models.map(
      (model): Task => {
        return new Task({
          id: model.id,
          name: model.name,
          taskGroupId: model.taskGroupId,
        })
      },
    )
    return entities
  }

  public async findById(taskId: string): Promise<Task> {
    const model = await this.prismaClient.task.findUnique({
      where: {
        id: taskId,
      },
      include: {
        users: true,
      },
    })
    if (model === null) {
      throw new Error(`${taskId}が見つかりませんでした`)
    }

    const entity = new Task({
      id: model.id,
      name: model.name,
      taskGroupId: model.taskGroupId,
    })
    return entity
  }

  public async save(task: Task): Promise<Task> {
    const { id, name, taskGroupId } = task.getAllProperties()

    const model = await this.prismaClient.task.upsert({
      where: {
        id,
      },
      update: {
        taskGroupId,
        name,
      },
      create: {
        id,
        name,
        taskGroupId,
      },
    })
    const entity = new Task({
      id: model.id,
      name: model.name,
      taskGroupId: model.taskGroupId,
    })
    return entity
  }

  public async delete(taskId: string): Promise<void> {
    await this.prismaClient.task.delete({
      where: {
        id: taskId,
      },
    })
  }

  public async deleteByTaskGroupId(taskGroupId: string): Promise<void> {
    await this.prismaClient.task.deleteMany({
      where: {
        taskGroupId,
      },
    })
  }
}
