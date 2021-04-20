export class TaskGroup {
  private id: string
  private name: string
  private tasks: Array<string>

  public constructor(props: { id: string; name: string; tasks: string[] }) {
    const { id, name, tasks } = props

    this.id = id
    this.name = name
    this.tasks = tasks
  }

  public getAllProperties() {
    return {
      id: this.id,
      name: this.name,
      tasks: this.tasks,
    }
  }
}
