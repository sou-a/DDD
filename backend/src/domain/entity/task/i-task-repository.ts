import { Task } from './task'

export interface ITaskRepository {
  findAll(): Array<Task>
  save(): void
  delete(taskId: string): void
}
