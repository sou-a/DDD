export class TaskDTO {
  public readonly id: string
  public readonly taskGroupId: string
  public readonly name: string
  public constructor(props: { id: string; name: string; taskGroupId: string }) {
    const { id, name, taskGroupId } = props
    this.id = id
    this.name = name
    this.taskGroupId = taskGroupId
  }
}

export class UserBelongTaskDTO {
  public readonly userId: string
  public readonly taskId: string
  public readonly status: string
  public constructor(props: {
    userId: string
    taskId: string
    status: string
  }) {
    const { userId, taskId, status } = props
    this.userId = userId
    this.taskId = taskId
    this.status = status
  }
}
