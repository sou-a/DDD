import { Task } from './task'

export interface ITaskRepository {
  findAll(): Promise<Task[]>
  findById(taskId: string): Promise<Task>
  save(task: Task): Promise<Task>
  delete(taskId: string): Promise<void>
  deleteByTaskGroupId(taskGroupId: string): Promise<void>
}
