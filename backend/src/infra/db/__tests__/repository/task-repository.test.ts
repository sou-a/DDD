import { createRandomIdString } from 'src/util/random'
import { prisma } from '@testUtil/prisma'
import { TaskRepository } from '../../repository/task-repository'
import { Task } from 'src/domain/entity/task/task'

describe('task-repository.ts', () => {
  const taskRepo = new TaskRepository(prisma)
  beforeAll(async () => {
    await prisma.task.deleteMany({})
  })
  afterAll(async () => {
    await prisma.$disconnect()
  })

  describe('findAll', () => {
    afterEach(async () => {
      await prisma.task.deleteMany({})
    })
    it('[正常系]taskを全て取得できる', async () => {
      const taskGroupExpected = [
        {
          id: '1',
          name: '1',
        },
      ]
      const tasksExpected = [
        {
          id: createRandomIdString(),
          taskGroupId: '1',
          name: '1',
        },
        {
          id: createRandomIdString(),
          taskGroupId: '1',
          name: '2',
        },
      ]
      await prisma.taskGroup.createMany({ data: taskGroupExpected })
      await prisma.task.createMany({ data: tasksExpected })
      expect(await taskRepo.findAll()).toHaveLength(2)
    })
  })

  describe('findById', () => {
    afterEach(async () => {
      await prisma.task.deleteMany({})
    })
    it('[正常系]特定のidのtaskを取得できる', async () => {
      const taskGroupExpected = [
        {
          id: '1',
          name: '1',
        },
      ]
      const tasksExpected = [
        {
          id: '1',
          taskGroupId: '1',
          name: '1',
        },
        {
          id: '2',
          taskGroupId: '1',
          name: '2',
        },
      ]
      await prisma.taskGroup.createMany({ data: taskGroupExpected })
      await prisma.task.createMany({ data: tasksExpected })
      expect(await taskRepo.findById('1')).toHaveLength(1)
    })
  })

  describe('save', () => {
    afterEach(async () => {
      await prisma.task.deleteMany({})
    })
    it('[正常系]taskを保存できる', async () => {
      const taskGroupExpected = [
        {
          id: '1',
          name: '1',
        },
      ]
      await prisma.taskGroup.createMany({ data: taskGroupExpected })
      const taskExpected = {
        id: createRandomIdString(),
        taskGroupId: '1',
        name: 'user1',
      }
      await taskRepo.save(new Task(taskExpected))

      const task = await prisma.task.findMany({})
      expect(task).toHaveLength(1)
      expect(task[0]).toEqual(taskExpected)
    })
  })

  describe('delete', () => {
    afterEach(async () => {
      await prisma.task.deleteMany({})
    })
    it('[正常系]特定のidのtaskを削除できる', async () => {
      const taskGroupExpected = [
        {
          id: '1',
          name: '1',
        },
      ]
      const tasksExpected = [
        {
          id: '1',
          taskGroupId: '1',
          name: '1',
        },
        {
          id: '2',
          taskGroupId: '1',
          name: '2',
        },
      ]
      await prisma.taskGroup.createMany({ data: taskGroupExpected })
      await prisma.task.createMany({ data: tasksExpected })
      await taskRepo.delete('1')
      const allTasks = await prisma.task.findMany({})
      expect(allTasks).toHaveLength(1)
    })
  })

  describe('deleteByTaskGroupId', () => {
    afterEach(async () => {
      await prisma.task.deleteMany({})
    })
    it('[正常系]特定のtaskGroupIdのtaskを削除できる', async () => {
      const taskGroupsExpected = [
        {
          id: '1',
          name: '1',
        },
        {
          id: '2',
          name: '2',
        },
      ]
      const tasksExpected = [
        {
          id: '1',
          taskGroupId: '1',
          name: '1',
        },
        {
          id: '2',
          taskGroupId: '2',
          name: '2',
        },
      ]
      await prisma.taskGroup.createMany({ data: taskGroupsExpected })
      await prisma.task.createMany({ data: tasksExpected })
      await taskRepo.deleteByTaskGroupId('1')
      const allTasks = await prisma.taskUser.findMany({})
      expect(allTasks).toHaveLength(1)
    })
  })
})
