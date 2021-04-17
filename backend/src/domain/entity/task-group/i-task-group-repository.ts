import { TaskGroup } from './task-group'

export interface ITaskGroupRepository {
  findAll(): Array<TaskGroup>
  save(): void
  delete(taskId: string): void
}
