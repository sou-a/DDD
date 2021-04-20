import { PrismaClient } from '@prisma/client'
import { ITaskGroupRepository } from 'src/domain/entity/task-group/i-task-group-repository'
import { TaskGroup } from 'src/domain/entity/task-group/task-group'

export class TaskGroupRepository implements ITaskGroupRepository {
  private prismaClient: PrismaClient

  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient
  }

  public async findAll(): Promise<TaskGroup[]> {
    const models = await this.prismaClient.taskGroup.findMany({
      include: {
        tasks: true,
      },
    })
    const entities: TaskGroup[] = models.map(
      (model): TaskGroup => {
        const taskIds: string[] = model.tasks.map((task) => {
          return task.id
        })
        return new TaskGroup({
          id: model.id,
          name: model.name,
          tasks: taskIds,
        })
      },
    )
    return entities
  }

  public async findById(taskGroupId: string): Promise<TaskGroup> {
    const model = await this.prismaClient.taskGroup.findUnique({
      where: {
        id: taskGroupId,
      },
      include: {
        tasks: true,
      },
    })
    if (model === null) {
      throw new Error(`ID: ${taskGroupId}が見つかりませんでした`)
    }

    const taskIds: string[] = model.tasks.map((task) => {
      return task.id
    })

    const entity = new TaskGroup({
      id: model.id,
      name: model.name,
      tasks: taskIds,
    })
    return entity
  }

  public async save(taskGroup: TaskGroup): Promise<TaskGroup> {
    const { id, name, tasks } = taskGroup.getAllProperties()

    const model = await this.prismaClient.taskGroup.create({
      data: {
        id,
        name,
      },
      include: {
        tasks: true,
      },
    })
    const taskIds: string[] = model.tasks.map((task) => {
      return task.id
    })
    const entity = new TaskGroup({
      id: model.id,
      name: model.name,
      tasks: taskIds,
    })
    return entity
  }

  public async delete(taskGroupId: string): Promise<void> {
    await this.prismaClient.taskGroup.delete({
      where: {
        id: taskGroupId,
      },
    })
  }
}
