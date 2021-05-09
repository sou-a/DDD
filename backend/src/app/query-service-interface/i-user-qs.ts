import { UserDTO } from '../dto/user-dto'

export interface IUserQS {
  findUsersByTasks(props: {
    taskIds: string[]
    taskStatus: string
    offset: number
  }): Promise<UserDTO[]>
}
