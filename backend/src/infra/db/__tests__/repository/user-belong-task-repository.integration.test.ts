import { prisma } from '@testUtil/prisma'
import { UserBelongTaskRepository } from '../../repository/user-belong-task-repository'
import { seedAllTaskStatus } from '@testUtil/task-status-factory'
import { UserBelongTask } from 'src/domain/entity/user-belong-task/user-belong-task'
import { TaskStatus } from 'src/domain/valueOblect/task-status'
import { seedUser } from '@testUtil/user/seed-user'
import { seedTaskGroup } from '@testUtil/task-group/seed-task-group'
import { seedTask } from '@testUtil/task/seed-task'

describe('user-belong-task-repository.ts', () => {
  const userBelongTaskRepo = new UserBelongTaskRepository(prisma)
  beforeAll(async () => {
    await prisma.taskUser.deleteMany({})
  })
  afterAll(async () => {
    await prisma.$disconnect()
  })

  describe('findAll', () => {
    afterEach(async () => {
      await prisma.taskUser.deleteMany({})
    })
    it('[正常系]userBelongTaskを全て取得できる', async () => {
      seedTaskGroup({ id: '1' })
      seedTask({ id: '1', taskGroupId: '1' })
      seedTask({ id: '2', taskGroupId: '1' })
      seedUser({ id: '1' })
      seedUser({ id: '2' })
      seedAllTaskStatus()
      const userBelongTaskExpected = [
        {
          userId: '1',
          taskId: '1',
          taskUserStatusId: '1',
        },
        {
          userId: '2',
          taskId: '1',
          taskUserStatusId: '1',
        },
      ]
      await prisma.taskUser.createMany({ data: userBelongTaskExpected })

      expect(await userBelongTaskRepo.findAll()).toHaveLength(1)
    })
  })

  describe('findByUserId', () => {
    afterEach(async () => {
      await prisma.taskUser.deleteMany({})
    })
    it('[正常系]特定のuserIdのuserBelongTaskを取得できる', async () => {
      seedTaskGroup({ id: '1' })
      seedTask({ id: '1', taskGroupId: '1' })
      seedTask({ id: '2', taskGroupId: '1' })
      seedUser({ id: '1' })
      seedUser({ id: '2' })
      seedAllTaskStatus()
      const userBelongTaskExpected = [
        {
          userId: '1',
          taskId: '1',
          taskUserStatusId: '1',
        },
        {
          userId: '2',
          taskId: '1',
          taskUserStatusId: '1',
        },
      ]
      await prisma.taskUser.createMany({ data: userBelongTaskExpected })

      expect(await userBelongTaskRepo.findByUserId('1')).toHaveLength(1)
    })
  })

  describe('save', () => {
    afterEach(async () => {
      await prisma.taskUser.deleteMany({})
    })
    it('[正常系]userBelongTaskを保存できる', async () => {
      seedTaskGroup({ id: '1' })
      seedTask({ id: '1', taskGroupId: '1' })
      seedUser({ id: '1' })
      seedAllTaskStatus()
      const userBelongTaskExpected = {
        userId: '1',
        taskId: '1',
        status: new TaskStatus(TaskStatus.notYet),
      }
      await userBelongTaskRepo.save(new UserBelongTask(userBelongTaskExpected))

      const task = await prisma.taskUser.findMany({})
      expect(task).toHaveLength(1)
      expect(task[0]).toEqual(userBelongTaskExpected)
    })
  })

  describe('deleteByTaskId', () => {
    afterEach(async () => {
      await prisma.taskUser.deleteMany({})
    })
    it('[正常系]特定のtaskIdのuserBelongTaskを削除できる', async () => {
      seedTaskGroup({ id: '1' })
      seedTask({ id: '1', taskGroupId: '1' })
      seedTask({ id: '2', taskGroupId: '1' })
      seedUser({ id: '1' })
      seedUser({ id: '2' })
      seedAllTaskStatus()
      const userBelongTaskExpected = [
        {
          userId: '1',
          taskId: '1',
          taskUserStatusId: '1',
        },
        {
          userId: '1',
          taskId: '2',
          taskUserStatusId: '1',
        },
      ]
      await prisma.taskUser.createMany({ data: userBelongTaskExpected })
      await userBelongTaskRepo.deleteByTaskId('1')
      const allTasks = await prisma.taskUser.findMany({})
      expect(allTasks).toHaveLength(1)
    })
  })

  describe('deleteByUserId', () => {
    afterEach(async () => {
      await prisma.taskUser.deleteMany({})
    })
    it('[正常系]特定のuserIdのuserBelongTaskを削除できる', async () => {
      seedTaskGroup({ id: '1' })
      seedTask({ id: '1', taskGroupId: '1' })
      seedTask({ id: '2', taskGroupId: '1' })
      seedUser({ id: '1' })
      seedUser({ id: '2' })
      seedAllTaskStatus()
      const userBelongTaskExpected = [
        {
          userId: '1',
          taskId: '1',
          taskUserStatusId: '1',
        },
        {
          userId: '2',
          taskId: '1',
          taskUserStatusId: '1',
        },
      ]
      await prisma.taskUser.createMany({ data: userBelongTaskExpected })
      await userBelongTaskRepo.deleteByUserId('1')
      const allTasks = await prisma.taskUser.findMany({})
      expect(allTasks).toHaveLength(1)
    })
  })
})
