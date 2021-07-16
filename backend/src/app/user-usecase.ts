import { IUserRepository } from 'src/domain/user/i-user-repository'
import { User } from 'src/domain/user/user'
import { UserService } from 'src/domain/user/user-service'
import { UserStatus } from 'src/domain/user/user-status'
import { createRandomIdString } from 'src/util/random'
import { UserDTO } from './dto/user-dto'
import { IUserQS } from './query-service-interface/i-user-qs'

// 参加者の一覧取得、新規追加、更新（少なくとも在籍ステータスを変更できること）、削除
export class UserUseCase {
  private userRepository: IUserRepository
  private userService: UserService
  private userQS: IUserQS

  public constructor(
    userRepository: IUserRepository,
    userService: UserService,
    userQS: IUserQS,
  ) {
    this.userRepository = userRepository
    this.userService = userService
    this.userQS = userQS
  }

  public async findAll(): Promise<UserDTO[]> {
    try {
      const users: User[] = await this.userRepository.findAll()
      return users.map((user: User) => {
        return new UserDTO({
          id: user.getAllProperties().id,
          name: user.getAllProperties().name,
          mailAddress: user.getAllProperties().mailAddress,
          status: user.getAllProperties().status.getStatus(),
        })
      })
    } catch (error) {
      throw error
    }
  }

  // 「特定の課題（複数可能）」が「特定の進捗ステータス」になっている参加者の一覧を、10人単位でページングして取得する
  public async findUsersByTasks(props: {
    taskIds: string[]
    taskStatus: string
    offset: number
  }): Promise<UserDTO[]> {
    const { taskIds, taskStatus, offset } = props
    return this.userQS.findUsersByTasks({ taskIds, taskStatus, offset })
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
      return new UserDTO({
        id: savedUser.getAllProperties().id,
        name: savedUser.getAllProperties().name,
        mailAddress: savedUser.getAllProperties().mailAddress,
        status: savedUser.getAllProperties().status.getStatus(),
      })
    } catch (error) {
      throw error
    }
  }

  public async changeStatus(props: {
    userId: string
    status: string
  }): Promise<UserDTO> {
    const { userId, status } = props

    const user = await this.userRepository.findById(userId)

    try {
      const changedUser = user.changeStatus(new UserStatus(status))
      const savedUser = await this.userRepository.save(changedUser)
      return new UserDTO({
        id: savedUser.getAllProperties().id,
        name: savedUser.getAllProperties().name,
        mailAddress: savedUser.getAllProperties().mailAddress,
        status: savedUser.getAllProperties().status.getStatus(),
      })
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
