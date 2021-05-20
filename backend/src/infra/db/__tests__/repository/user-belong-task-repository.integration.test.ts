import { prisma } from '@testUtil/prisma'
import { UserBelongTaskRepository } from '../../repository/user-belong-task-repository'
import { seedAllTaskStatus } from '@testUtil/task-status-factory'
import { UserBelongTask } from 'src/domain/entity/user-belong-task/user-belong-task'
import { TaskStatus } from 'src/domain/valueOblect/task-status'
import { seedUser } from '@testUtil/user/seed-user'
import { seedTaskGroup } from '@testUtil/task-group/seed-task-group'
import { seedTask } from '@testUtil/task/seed-task'
import { seedAllUserStatus } from '@testUtil/user-status-factory'
import { seedUserBelongTask } from '@testUtil/user-belong-task/seed-user-belong-task'

describe('user-belong-task-repository.integration.ts', () => {
  const userBelongTaskRepo = new UserBelongTaskRepository(prisma)
  beforeEach(async () => {
    await prisma.taskUser.deleteMany()
    await prisma.task.deleteMany()
    await prisma.taskGroup.deleteMany()
    await prisma.user.deleteMany()
    await prisma.userStatus.deleteMany()
    await prisma.taskUserStatus.deleteMany()
  })
  afterAll(async () => {
    await prisma.taskUser.deleteMany()
    await prisma.task.deleteMany()
    await prisma.taskGroup.deleteMany()
    await prisma.user.deleteMany()
    await prisma.userStatus.deleteMany()
    await prisma.taskUserStatus.deleteMany()

    await prisma.$disconnect()
  })

  describe('findAll', () => {
    it('[正常系]userBelongTaskを全て取得できる', async () => {
      await seedAllTaskStatus()
      await seedAllUserStatus()
      await seedTaskGroup({ id: '1' })
      await seedTask({ id: '1', taskGroupId: '1' })
      await seedUser({ id: '1' })
      await seedUser({ id: '2' })
      await seedUserBelongTask({ userId: '1', taskId: '1' })
      await seedUserBelongTask({ userId: '2', taskId: '1' })

      const userBelongTasks = await userBelongTaskRepo.findAll()
      expect(userBelongTasks).toHaveLength(2)
      userBelongTasks.map((userBelongTask) => {
        expect(userBelongTask).toEqual(expect.any(UserBelongTask))
      })
    })
  })

  describe('findByUserId', () => {
    it('[正常系]特定のuserIdのuserBelongTaskを取得できる', async () => {
      await seedAllTaskStatus()
      await seedAllUserStatus()
      await seedTaskGroup({ id: '1' })
      await seedTask({ id: '1', taskGroupId: '1' })
      await seedUser({ id: '1' })
      await seedUser({ id: '2' })
      await seedUserBelongTask({ userId: '1', taskId: '1' })
      await seedUserBelongTask({ userId: '2', taskId: '1' })

      const userBelongTasks = await userBelongTaskRepo.findByUserId('1')
      expect(userBelongTasks[0]).toEqual(expect.any(UserBelongTask))
      expect(userBelongTasks[0]).toEqual({
        userId: '1',
        taskId: '1',
        status: expect.any(TaskStatus),
      })
    })
  })

  describe('save', () => {
    it('[正常系]userBelongTaskを保存できる', async () => {
      await seedAllTaskStatus()
      await seedAllUserStatus()
      await seedTaskGroup({ id: '1' })
      await seedTask({ id: '1', taskGroupId: '1' })
      await seedUser({ id: '1' })

      const userBelongTaskExpected = {
        userId: '1',
        taskId: '1',
        status: new TaskStatus(TaskStatus.notYet),
      }
      await userBelongTaskRepo.save(new UserBelongTask(userBelongTaskExpected))

      const userBelongTasks = await prisma.taskUser.findMany()
      expect(userBelongTasks).toHaveLength(1)
      userBelongTasks.map((userBelongTask) => {
        expect(userBelongTask).toEqual({
          userId: '1',
          taskId: '1',
          taskUserStatusId: expect.any(String),
        })
      })
    })
  })

  describe('deleteByTaskId', () => {
    it('[正常系]特定のtaskIdのuserBelongTaskを削除できる', async () => {
      await seedAllTaskStatus()
      await seedAllUserStatus()
      await seedTaskGroup({ id: '1' })
      await seedTask({ id: '1', taskGroupId: '1' })
      await seedTask({ id: '2', taskGroupId: '1' })
      await seedUser({ id: '1' })
      await seedUser({ id: '2' })
      await seedUserBelongTask({ userId: '1', taskId: '1' })
      await seedUserBelongTask({ userId: '2', taskId: '1' })
      await seedUserBelongTask({ userId: '1', taskId: '2' })

      await userBelongTaskRepo.deleteByTaskId('1')
      const userBelongTasks = await prisma.taskUser.findMany()
      expect(userBelongTasks).toHaveLength(1)
      userBelongTasks.map((userBelongTask) => {
        expect(userBelongTask).toEqual({
          userId: '1',
          taskId: '2',
          taskUserStatusId: expect.any(String),
        })
      })
    })
  })

  describe('deleteByUserId', () => {
    it('[正常系]特定のuserIdのuserBelongTaskを削除できる', async () => {
      await seedAllTaskStatus()
      await seedAllUserStatus()
      await seedTaskGroup({ id: '1' })
      await seedTask({ id: '1', taskGroupId: '1' })
      await seedTask({ id: '2', taskGroupId: '1' })
      await seedUser({ id: '1' })
      await seedUser({ id: '2' })
      await seedUserBelongTask({ userId: '1', taskId: '1' })
      await seedUserBelongTask({ userId: '1', taskId: '2' })
      await seedUserBelongTask({ userId: '2', taskId: '1' })

      await userBelongTaskRepo.deleteByUserId('1')
      const userBelongTasks = await prisma.taskUser.findMany()
      expect(userBelongTasks).toHaveLength(1)
      userBelongTasks.map((userBelongTask) => {
        expect(userBelongTask).toEqual({
          userId: '2',
          taskId: '1',
          taskUserStatusId: expect.any(String),
        })
      })
    })
  })
})
