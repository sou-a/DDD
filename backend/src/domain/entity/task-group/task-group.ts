export class TaskGroup {
  private id: string
  private name: string
  private tasks: string[]

  public constructor(props: { id: string; name: string; tasks: string[] }) {
    const { id, name, tasks } = props

    this.id = id
    this.name = name
    this.tasks = tasks
  }

  public changeName(name: string): TaskGroup {
    this.name = name
    return this
  }

  public getAllProperties() {
    return {
      id: this.id,
      name: this.name,
      tasks: this.tasks,
    }
  }
}
