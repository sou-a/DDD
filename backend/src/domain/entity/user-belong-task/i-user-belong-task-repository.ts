import { UserBelongTask } from './user-belong-task'

export interface IUserBelongTaskRepository {
  findAll(): Array<UserBelongTask>
  save(): void
  delete(taskId: string): void
}
