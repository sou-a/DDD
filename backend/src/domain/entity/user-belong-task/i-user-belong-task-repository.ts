import { UserBelongTask } from './user-belong-task'

export interface IUserBelongTaskRepository {
  findAll(): Promise<UserBelongTask[]>
  findByUserId(userBelongTaskId: string): Promise<UserBelongTask[]>
  save(userBelongTask: UserBelongTask): Promise<UserBelongTask>
  deleteByTaskId(userBelongTaskId: string): Promise<void>
  deleteByUserId(userBelongTaskId: string): Promise<void>
}
