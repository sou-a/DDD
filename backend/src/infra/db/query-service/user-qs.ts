import { PrismaClient } from '@prisma/client'
import { UserDTO } from 'src/app/dto/user-dto'
import { IUserQS } from 'src/app/query-service-interface/i-user-qs'
import { User } from 'src/domain/user/user'
import { TaskStatus } from 'src/domain/task/task-status'
import { UserStatus } from 'src/domain/user/user-status'

export class UserQS implements IUserQS {
  private prismaClient: PrismaClient

  take = 10

  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient
  }

  public async findUsersByTasks(props: {
    taskIds: string[]
    taskStatus: string
    offset: number
  }): Promise<UserDTO[]> {
    const { taskIds, taskStatus, offset } = props
    const status = await this.prismaClient.taskUserStatus.findFirst({
      where: {
        name: new TaskStatus(taskStatus).getStatus(),
      },
      select: {
        id: true,
      },
    })
    if (!status) {
      throw new Error('想定外のエラー')
    }
    const firstQuery = `SELECT tu."userId" from "TaskUser" as tu WHERE tu."taskId" = '${taskIds[0]}' AND tu."taskUserStatusId" = '${status.id}'`

    let query = firstQuery
    if (taskIds.length >= 2) {
      taskIds.shift()
      taskIds.map((taskId) => {
        const nextQuery = ` INTERSECT SELECT tu."userId" from "TaskUser" as tu WHERE tu."taskId" = '${taskId}' AND tu."taskUserStatusId" = '${status.id}'`
        query = query + nextQuery
      })
    }
    const results = await this.prismaClient.$queryRaw(query)
    const userIds = results.map((result: { userId: string }) => {
      return result.userId
    })

    const usersByTasks = await this.prismaClient.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
      take: this.take,
      skip: this.take * offset,
      include: {
        userStatus: true,
      },
      orderBy: {
        id: 'asc',
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
