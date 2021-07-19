import { User } from './user'
import { UserId } from './user-id'

export interface IUserRepository {
  findAll(): Promise<User[]>
  findById(userId: UserId): Promise<User>
  save(user: User): Promise<User> // upsertのイメージ
  delete(userId: UserId): Promise<void>
}
