import { TaskGroup } from './task-group'

export interface ITaskGroupRepository {
  findAll(): Promise<TaskGroup[]>
  findById(taskGroupId: string): Promise<TaskGroup>
  save(taskGroup: TaskGroup): Promise<TaskGroup>
  delete(taskGroupId: string): Promise<void>
}
