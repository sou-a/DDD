import { createRandomIdString } from 'src/util/random'
import { prisma } from '@testUtil/prisma'
import { TaskGroupRepository } from '../../repository/task-group-repository'
import { TaskGroup } from 'src/domain/entity/task-group/task-group'

describe('task-group-repository.ts', () => {
  const taskGroupRepo = new TaskGroupRepository(prisma)
  beforeAll(async () => {
    await prisma.taskGroup.deleteMany({})
  })
  afterAll(async () => {
    await prisma.$disconnect()
  })

  describe('findAll', () => {
    afterEach(async () => {
      await prisma.taskGroup.deleteMany({})
    })
    it('[正常系]taskGroupを全て取得できる', async () => {
      const taskGroupExpected = [
        {
          id: '1',
          name: '1',
        },
        {
          id: '2',
          name: '2',
        },
      ]
      await prisma.taskGroup.createMany({ data: taskGroupExpected })
      expect(await taskGroupRepo.findAll()).toHaveLength(2)
    })
  })

  describe('findById', () => {
    afterEach(async () => {
      await prisma.taskGroup.deleteMany({})
    })
    it('[正常系]特定のidのtaskGroupを取得できる', async () => {
      const taskGroupExpected = [
        {
          id: '1',
          name: '1',
        },
        {
          id: '2',
          name: '2',
        },
      ]
      await prisma.taskGroup.createMany({ data: taskGroupExpected })
      expect(await taskGroupRepo.findById('1')).toHaveLength(1)
    })
  })

  describe('save', () => {
    afterEach(async () => {
      await prisma.taskGroup.deleteMany({})
    })
    it('[正常系]taskGroupを保存できる', async () => {
      const taskGroupExpected = {
        id: createRandomIdString(),
        name: 'task1',
        tasks: [createRandomIdString(), createRandomIdString()],
      }
      await taskGroupRepo.save(new TaskGroup(taskGroupExpected))

      const task = await prisma.taskGroup.findMany({})
      expect(task).toHaveLength(1)
      expect(task[0]).toEqual(taskGroupExpected)
    })
  })

  describe('delete', () => {
    afterEach(async () => {
      await prisma.taskGroup.deleteMany({})
    })
    it('[正常系]特定のidのtaskGroupを削除できる', async () => {
      const taskGroupExpected = [
        {
          id: '1',
          name: '1',
        },
        {
          id: '2',
          name: '2',
        },
      ]
      await prisma.taskGroup.createMany({ data: taskGroupExpected })
      await taskGroupRepo.delete('1')
      const allTasks = await prisma.taskGroup.findMany({})
      expect(allTasks).toHaveLength(1)
    })
  })
})
