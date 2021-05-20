import * as faker from 'faker'
import { prisma } from '@testUtil/prisma'
import { UserBelongTask } from 'src/domain/entity/user-belong-task/user-belong-task'
import { TaskStatus } from 'src/domain/valueOblect/task-status'

export const seedUserBelongTask = async (params: {
  userId?: string
  taskId?: string
  status?: TaskStatus
}) => {
  let { userId, taskId, status } = params
  userId = userId ?? faker.random.uuid()
  taskId = taskId ?? faker.random.uuid()
  status = status ?? new TaskStatus(TaskStatus.notYet)
  const taskUserStatus = await prisma.taskUserStatus.findFirst({
    where: {
      name: status.getStatus(),
    },
  })
  if (!taskUserStatus) {
    throw new Error('想定外のエラー')
  }
  await prisma.taskUser.create({
    data: {
      userId,
      taskId,
      taskUserStatusId: taskUserStatus.id,
    },
  })
  return new UserBelongTask({
    userId,
    taskId,
    status,
  })
}
