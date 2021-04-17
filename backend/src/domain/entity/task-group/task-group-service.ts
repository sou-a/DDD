import { Injectable } from '@nestjs/common'
import { ITaskRepository } from '../task/i-task-repository'
import { IUserBelongTaskRepository } from '../user-belong-task/i-user-belong-task-repository'
import { ITaskGroupRepository } from './i-task-group-repository'

@Injectable()
export class TaskGroupService {
  private taskGroupRepository: ITaskGroupRepository
  private taskRepository: ITaskRepository
  private userBelongTaskRepository: IUserBelongTaskRepository

  public constructor(props: {
    taskGroupRepository: ITaskGroupRepository
    taskRepository: ITaskRepository
    userBelongTaskRepository: IUserBelongTaskRepository
  }) {
    const {
      taskGroupRepository,
      taskRepository,
      userBelongTaskRepository,
    } = props

    this.taskGroupRepository = taskGroupRepository
    this.taskRepository = taskRepository
    this.userBelongTaskRepository = userBelongTaskRepository
  }

  public delete(taskId: string) {
    // タスクグループ削除
    this.taskGroupRepository.delete(taskId)

    // タスク削除
    this.taskRepository.delete(taskId)

    // ユーザーが所持するタスク削除
    this.userBelongTaskRepository.delete(taskId)
  }
}
