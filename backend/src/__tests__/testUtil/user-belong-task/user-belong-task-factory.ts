import * as faker from 'faker'
import { UserBelongTask } from 'src/domain/user-belong-task/user-belong-task'
import { TaskStatus } from 'src/domain/task/task-status'

export const createUserBelongTask = (params: {
  userId?: string
  taskId?: string
  status?: TaskStatus
}) => {
  const { userId, taskId, status } = params
  return new UserBelongTask({
    userId: userId ?? faker.random.uuid(),
    taskId: taskId ?? faker.random.uuid(),
    status: status ?? new TaskStatus(TaskStatus.notYet),
  })
}
