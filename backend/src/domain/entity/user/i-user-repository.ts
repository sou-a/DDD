import { User } from './user'

export interface IUserRepository {
  findAll(): Promise<User[]>
  findById(userId: string): Promise<User>
  save(user: User): Promise<User> // upsertのイメージ
  delete(userId: string): Promise<void>
}
