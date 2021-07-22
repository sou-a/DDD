import { TaskId } from './task-id'

export class Task {
  private id: TaskId
  private taskGroupId: string
  private name: string

  public constructor(props: { id: TaskId; taskGroupId: string; name: string }) {
    const { id, name, taskGroupId } = props

    this.id = id
    this.name = name
    // - 全ての課題は、いずれかの課題グループに属している
    this.taskGroupId = taskGroupId
  }

  public changeTaskGroupId(taskGroupId: string): Task {
    this.taskGroupId = taskGroupId
    return this
  }

  public getAllProperties() {
    return {
      id: this.id,
      name: this.name,
      taskGroupId: this.taskGroupId,
    }
  }
}