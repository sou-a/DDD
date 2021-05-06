import { IUserRepository } from 'src/domain/entity/user/i-user-repository'
import { User } from 'src/domain/entity/user/user'
import { UserService } from 'src/domain/entity/user/user-service'
import { UserStatus } from 'src/domain/valueOblect/user-status'
import { createRandomIdString } from 'src/util/random'
import { UserDTO } from './dto/user-dto'

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

  public async findAll(): Promise<UserDTO[]> {
    try {
      const users: User[] = await this.userRepository.findAll()
      return users.map((user: User) => {
        return new UserDTO({ ...user.getAllProperties() })
      })
    } catch (error) {
      throw error
    }
  }

  public async create(props: {
    name: string
    mailAddress: string
    status: string
  }): Promise<UserDTO> {
    const { name, mailAddress, status } = props
    const user = new User({
      id: createRandomIdString(),
      name: name,
      mailAddress: mailAddress,
      status: new UserStatus(status),
    })

    try {
      const savedUser = await this.userRepository.save(user)
      return new UserDTO({ ...savedUser.getAllProperties() })
    } catch (error) {
      throw error
    }
  }

  // TODO: メールアドレス等変更したい場合はどうするんだろ（ドメインオブジェクト側で全部用意するのかな（new User で詰め替えるのはNGな気がするし））
  public async changeStatus(props: {
    userId: string
    status: string
  }): Promise<UserDTO> {
    const { userId, status } = props

    const user = await this.userRepository.findById(userId)

    try {
      const changedUser = user.changeStatus(new UserStatus(status))
      const savedUser = await this.userRepository.save(changedUser)
      return new UserDTO({ ...savedUser.getAllProperties() })
    } catch (error) {
      throw error
    }
  }

  public async delete(prop: { userId: string }): Promise<boolean> {
    const { userId } = prop
    try {
      return this.userService.deleteUser(userId)
    } catch (error) {
      throw error
    }
  }
}
