import { PrismaClient } from '@prisma/client'
import { UserDTO } from 'src/app/dto/user-dto'
import { IUserQS } from 'src/app/query-service-interface/i-user-qs'
import { User } from 'src/domain/entity/user/user'
import { TaskStatus } from 'src/domain/valueOblect/task-status'
import { UserStatus } from 'src/domain/valueOblect/user-status'

export class UserQS implements IUserQS {
  private prismaClient: PrismaClient
  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient
  }

  public async findUsersByTasks(props: {
    taskIds: string[]
    taskStatus: string
    offset: number
  }): Promise<UserDTO[]> {
    const { taskIds, taskStatus, offset } = props
    const usersByTasks = await this.prismaClient.user.findMany({
      take: 10, // TODO: この情報の置き場所
      skip: 10 * offset,
      include: {
        // TODO: このくらいのネストはリポジトリでもやっちゃってたけど...？
        userStatus: true,
        tasks: {
          where: {
            taskId: taskIds[0], // TODO: まとめて処理して欲しい
            taskUserStatus: {
              name: new TaskStatus(taskStatus).getStatus(),
            },
          },
        },
      },
    })
    const usersByTasksEntity: User[] = usersByTasks.map((userByTask) => {
      return new User({
        id: userByTask.id,
        name: userByTask.name,
        mailAddress: userByTask.mailAddress,
        status: new UserStatus(userByTask.userStatus.name),
      })
    })
    return usersByTasksEntity.map(
      (usersByTask: User) =>
        new UserDTO({
          id: usersByTask.getAllProperties().id,
          name: usersByTask.getAllProperties().name,
          mailAddress: usersByTask.getAllProperties().mailAddress,
          status: usersByTask.getAllProperties().status.getStatus(),
        }),
    )
  }
}
