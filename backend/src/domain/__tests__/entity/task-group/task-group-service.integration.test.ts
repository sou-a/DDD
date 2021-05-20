import { mocked } from 'ts-jest/utils'
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing'
import { TaskGroupService } from 'src/domain/entity/task-group/task-group-service'
import { TaskRepository } from 'src/infra/db/repository/task-repository'
import { TaskGroupRepository } from 'src/infra/db/repository/task-group-repository'
import { UserBelongTaskRepository } from 'src/infra/db/repository/user-belong-task-repository'
import { TaskGroup } from 'src/domain/entity/task-group/task-group'
import { prisma } from '@testUtil/prisma'
import { seedTaskGroup } from '@testUtil/task-group/seed-task-group'
import { seedUser } from '@testUtil/user/seed-user'
import { seedTask } from '@testUtil/task/seed-task'
import { seedAllTaskStatus } from '@testUtil/task-status-factory'
import { seedAllUserStatus } from '@testUtil/user-status-factory'
import { seedUserBelongTask } from '@testUtil/user-belong-task/seed-user-belong-task'

describe('task-group-service.integration.ts', () => {
  let mockTaskRepo: MockedObjectDeep<TaskRepository>
  let mockTaskGroupRepo: MockedObjectDeep<TaskGroupRepository>
  let mockUserBelongTaskRepo: MockedObjectDeep<UserBelongTaskRepository>
  beforeAll(() => {
    mockTaskRepo = mocked(new TaskRepository(prisma), true)
    mockTaskGroupRepo = mocked(new TaskGroupRepository(prisma), true)
    mockUserBelongTaskRepo = mocked(new UserBelongTaskRepository(prisma), true)
  })
  beforeEach(async () => {
    await prisma.taskUser.deleteMany()
    await prisma.user.deleteMany()
    await prisma.task.deleteMany()
    await prisma.taskGroup.deleteMany()
    await prisma.userStatus.deleteMany()
    await prisma.taskUserStatus.deleteMany()
  })
  afterAll(async () => {
    await prisma.taskUser.deleteMany()
    await prisma.user.deleteMany()
    await prisma.task.deleteMany()
    await prisma.taskGroup.deleteMany()
    await prisma.userStatus.deleteMany()
    await prisma.taskUserStatus.deleteMany()

    await prisma.$disconnect()
  })
  describe('delete', () => {
    it('[正常系]タスクを削除したとき関連する中間テーブルからも削除する', async () => {
      const taskGroupService = new TaskGroupService({
        taskRepository: mockTaskRepo,
        taskGroupRepository: mockTaskGroupRepo,
        userBelongTaskRepository: mockUserBelongTaskRepo,
      })

      await seedAllTaskStatus()
      await seedAllUserStatus()
      await seedTaskGroup({ id: '1' })
      await seedUser({ id: '1' })
      await seedTask({ id: '1', taskGroupId: '1' })
      await seedTask({ id: '2', taskGroupId: '1' })
      await seedTask({ id: '3', taskGroupId: '1' })
      await seedUserBelongTask({ userId: '1', taskId: '1' })
      await seedUserBelongTask({ userId: '1', taskId: '2' })
      await seedUserBelongTask({ userId: '1', taskId: '3' })

      let userBelongTask = await prisma.taskUser.findMany()
      let taskGroup = await prisma.taskGroup.findMany()
      let task = await prisma.task.findMany()

      expect(userBelongTask).toHaveLength(3)
      expect(taskGroup).toHaveLength(1)
      expect(task).toHaveLength(3)

      await taskGroupService.delete(
        new TaskGroup({
          id: '1',
          name: 'A',
          tasks: ['1', '2', '3'],
        }),
      )

      userBelongTask = await prisma.taskUser.findMany()
      taskGroup = await prisma.taskGroup.findMany()
      task = await prisma.task.findMany()

      expect(userBelongTask).toHaveLength(0)
      expect(taskGroup).toHaveLength(0)
      expect(task).toHaveLength(0)
    })
  })
})
