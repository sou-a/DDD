import { UserBelongTask } from './user-belong-task'

export interface IUserBelongTaskRepository {
  findAll(): Promise<UserBelongTask[]>
  findByUserIdAndTaskId(userId: string, TaskId: string): Promise<UserBelongTask>
  findByUserId(userId: string): Promise<UserBelongTask[]>
  save(userBelongTask: UserBelongTask): Promise<UserBelongTask>
  deleteByTaskId(taskId: string): Promise<void>
  deleteByUserId(userId: string): Promise<void>
}
