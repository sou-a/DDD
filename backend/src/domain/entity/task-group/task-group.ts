export class TaskGroup {
  private id: string
  private name: string
  private tasks: Array<string>

  public constructor(props: {
    id: string
    name: string
    tasks: Array<string>
  }) {
    const { id, name, tasks } = props

    this.id = id
    this.name = name
    this.tasks = tasks
  }
}
