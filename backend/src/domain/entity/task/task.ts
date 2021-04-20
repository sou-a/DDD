export class Task {
  private id: string
  private taskGroupId: string
  private name: string

  public constructor(props: { id: string; taskGroupId: string; name: string }) {
    const { id, name, taskGroupId } = props

    this.id = id
    this.name = name
    // - 全ての課題は、いずれかの課題グループに属している
    this.taskGroupId = taskGroupId // IDあるかチェックすべきだが、仕様に書いてないので一旦パス
  }

  public getAllProperties() {
    return {
      id: this.id,
      name: this.name,
      taskGroupId: this.taskGroupId,
    }
  }
}