import { IUserRepository } from 'src/domain/entity/user/i-user-repository'
import { User } from 'src/domain/entity/user/user'
import { UserService } from 'src/domain/entity/user/user-service'
import { createRandomIdString } from 'src/util/random'

// 参加者の一覧取得、新規追加、更新（少なくとも在籍ステータスを変更できること）、削除
export class UserUseCase {
  private userRepository: IUserRepository
  private userService: UserService

  public constructor(
    userRepository: IUserRepository,
    userService: UserService,
  ) {
    this.userRepository = userRepository
    this.userService = userService
  }

  public findAll() {
    try {
      return this.userRepository.findAll()
    } catch (error) {
      throw error
    }
  }

  public upsert(name: string, mailAddress: string, status: string) {
    const user = new User({
      id: createRandomIdString(),
      name: name,
      mailAddress: mailAddress,
      status: status,
    })

    try {
      return this.userRepository.save(user)
    } catch (error) {
      throw error
    }
  }

  public async changeStatus(userId: string, status: string): Promise<User> {
    const user = this.userRepository.findById(userId)

    try {
      return (await user).changeStatus(status)
    } catch (error) {
      throw error
    }
  }

  public delete(userId: string) {
    try {
      return this.userService.delete(userId)
    } catch (error) {
      throw error
    }
  }
}
