import { TaskId } from 'src/domain/task/task-id'
import { UserId } from 'src/domain/user/user-id'

export class TaskDTO {
  public readonly id: TaskId
  public readonly taskGroupId: string
  public readonly name: string
  public constructor(props: { id: TaskId; name: string; taskGroupId: string }) {
    const { id, name, taskGroupId } = props
    this.id = id
    this.name = name
    this.taskGroupId = taskGroupId
  }
}

export class UserBelongTaskDTO {
  public readonly userId: UserId
  public readonly taskId: TaskId
  public readonly status: string
  public constructor(props: {
    userId: UserId
    taskId: TaskId
    status: string
  }) {
    const { userId, taskId, status } = props
    this.userId = userId
    this.taskId = taskId
    this.status = status
  }
}
