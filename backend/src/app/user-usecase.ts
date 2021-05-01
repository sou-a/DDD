import { IUserRepository } from 'src/domain/entity/user/i-user-repository'
import { User } from 'src/domain/entity/user/user'
import { UserService } from 'src/domain/entity/user/user-service'
import { UserStatus } from 'src/domain/valueOblect/user-status'
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

  public async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.findAll()
    } catch (error) {
      throw error
    }
  }

  public async upsert(
    name: string,
    mailAddress: string,
    status: string,
  ): Promise<User> {
    const user = new User({
      id: createRandomIdString(),
      name: name,
      mailAddress: mailAddress,
      status: new UserStatus(status),
    })

    try {
      return await this.userRepository.save(user)
    } catch (error) {
      throw error
    }
  }

  public async changeStatus(userId: string, status: string): Promise<User> {
    const user = await this.userRepository.findById(userId)

    try {
      return user.changeStatus(new UserStatus(status))
    } catch (error) {
      throw error
    }
  }

  public async delete(userId: string): Promise<void> {
    try {
      this.userService.deleteUser(userId)
    } catch (error) {
      throw error
    }
  }
}
