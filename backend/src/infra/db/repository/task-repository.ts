import { PrismaClient } from '@prisma/client'
import { ITaskRepository } from 'src/domain/entity/task/i-task-repository'
import { Task } from 'src/domain/entity/task/task'

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

    const model = await this.prismaClient.task.create({
      data: {
        id,
        taskGroupId,
        name,
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
}
