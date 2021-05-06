export class TaskGroupDTO {
  public readonly id: string
  public readonly name: string
  public readonly tasks: string[]
  public constructor(props: { id: string; name: string; tasks: string[] }) {
    const { id, name, tasks } = props
    this.id = id
    this.name = name
    this.tasks = tasks
  }
}
