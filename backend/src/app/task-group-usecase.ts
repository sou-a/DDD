import { ITaskGroupRepository } from 'src/domain/entity/task-group/i-task-group-repository'
import { TaskGroup } from 'src/domain/entity/task-group/task-group'
import { TaskGroupService } from 'src/domain/entity/task-group/task-group-service'
import { createRandomIdString } from 'src/util/random'
import { TaskGroupDTO } from './dto/task-group-dto'

// 課題グループの一覧取得、新規追加、更新、削除
export class TaskGroupUseCase {
  private taskGroupRepository: ITaskGroupRepository
  private taskGroupService: TaskGroupService

  public constructor(
    taskGroupRepository: ITaskGroupRepository,
    taskGroupService: TaskGroupService,
  ) {
    this.taskGroupRepository = taskGroupRepository
    this.taskGroupService = taskGroupService
  }

  public async findAll(): Promise<TaskGroupDTO[]> {
    try {
      const taskGroups: TaskGroup[] = await this.taskGroupRepository.findAll()
      return taskGroups.map((taskGroup: TaskGroup) => {
        return new TaskGroupDTO({ ...taskGroup.getAllProperties() })
      })
    } catch (error) {
      throw error
    }
  }

  public async create(props: { name: string }): Promise<TaskGroupDTO> {
    const { name } = props
    const taskGroup: TaskGroup = new TaskGroup({
      id: createRandomIdString(),
      name,
      tasks: [], // TODO: 微妙？
    })
    try {
      const savedTaskGroup = await this.taskGroupRepository.save(taskGroup)
      return new TaskGroupDTO({ ...savedTaskGroup.getAllProperties() })
    } catch (error) {
      throw error
    }
  }

  public async changeName(props: {
    taskGroupId: string
    name: string
  }): Promise<TaskGroupDTO> {
    const { taskGroupId, name } = props

    const taskGroup: TaskGroup = await this.taskGroupRepository.findById(
      taskGroupId,
    )

    try {
      const changedTaskGroup = taskGroup.changeName(name)
      const savedTaskGroup = await this.taskGroupRepository.save(
        changedTaskGroup,
      )
      return new TaskGroupDTO({
        ...savedTaskGroup.getAllProperties(),
      })
    } catch (error) {
      throw error
    }
  }

  public async delete(prop: { taskGroupId: string }): Promise<void> {
    const { taskGroupId } = prop
    const taskGroup: TaskGroup = await this.taskGroupRepository.findById(
      taskGroupId,
    )
    try {
      await this.taskGroupService.delete(taskGroup)
    } catch (error) {
      throw error
    }
  }
}
