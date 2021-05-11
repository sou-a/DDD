import { PrismaClient } from '@prisma/client'
import { mocked } from 'ts-jest/utils'
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing'
import { UserRepository } from 'src/infra/db/repository/user-repository'
import { TaskRepository } from 'src/infra/db/repository/task-repository'
import { UserBelongTaskRepository } from 'src/infra/db/repository/user-belong-task-repository'
import { TaskUseCase } from '../task-usecase'
import { TaskStatus } from 'src/domain/valueOblect/task-status'

jest.mock('@prisma/client')
jest.mock('src/infra/db/repository/user-repository')

describe('task-usecase.ts', () => {
  let mockUserRepo: MockedObjectDeep<UserRepository>
  let mockTaskRepo: MockedObjectDeep<TaskRepository>
  let mockUserBelongTaskRepo: MockedObjectDeep<UserBelongTaskRepository>
  beforeAll(() => {
    const prisma = new PrismaClient()
    mockUserRepo = mocked(new UserRepository(prisma), true)
    mockTaskRepo = mocked(new TaskRepository(prisma), true)
    mockUserBelongTaskRepo = mocked(new UserBelongTaskRepository(prisma), true)
  })
  describe('findAll', () => {
    const usecase = new TaskUseCase(mockTaskRepo, mockUserBelongTaskRepo)
    it('[正常系]: 例外が発生しない', async () => {
      return expect(usecase.findAll()).resolves.toBe(undefined)
    })
    it('[準正常系]: findAllで例外が発生した場合、例外が発生する', () => {
      const ERROR_MESSAGE = 'error!'
      mockUserRepo.save.mockRejectedValueOnce(ERROR_MESSAGE)
      return expect(usecase.findAll()).rejects.toEqual(ERROR_MESSAGE)
    })
  })

  describe('create', () => {
    it('[正常系]: 例外が発生しない', async () => {
      const usecase = new TaskUseCase(mockTaskRepo, mockUserBelongTaskRepo)
      return expect(
        usecase.create({
          taskGroupId: '1',
          name: 'task1',
        }),
      ).resolves.toBe(undefined)
    })
    it('[準正常系]: createで例外が発生した場合、例外が発生する', () => {
      const ERROR_MESSAGE = 'error!'
      mockUserRepo.save.mockRejectedValueOnce(ERROR_MESSAGE)
      const usecase = new TaskUseCase(mockTaskRepo, mockUserBelongTaskRepo)
      return expect(
        usecase.create({
          taskGroupId: '1',
          name: 'task1',
        }),
      ).rejects.toEqual(ERROR_MESSAGE)
    })
  })

  describe('changeStatus', () => {
    it('[正常系]: 例外が発生しない', async () => {
      const usecase = new TaskUseCase(mockTaskRepo, mockUserBelongTaskRepo)
      return expect(
        usecase.changeStatus({
          userId: '1',
          taskId: '1',
          status: TaskStatus.review,
        }),
      ).resolves.toBe(undefined)
    })
    it('[準正常系]: changeStatusで例外が発生した場合、例外が発生する', () => {
      const ERROR_MESSAGE = 'error!'
      mockUserRepo.save.mockRejectedValueOnce(ERROR_MESSAGE)
      const usecase = new TaskUseCase(mockTaskRepo, mockUserBelongTaskRepo)
      return expect(
        usecase.changeStatus({
          userId: '1',
          taskId: '1',
          status: TaskStatus.review,
        }),
      ).rejects.toEqual(ERROR_MESSAGE)
    })
  })

  describe('changeTaskGroup', () => {
    it('[正常系]: 例外が発生しない', async () => {
      const usecase = new TaskUseCase(mockTaskRepo, mockUserBelongTaskRepo)
      return expect(
        usecase.changeTaskGroup({
          taskId: '1',
          taskGroupId: '1',
        }),
      ).resolves.toBe(undefined)
    })
    it('[準正常系]: changeTaskGroupで例外が発生した場合、例外が発生する', () => {
      const ERROR_MESSAGE = 'error!'
      mockUserRepo.save.mockRejectedValueOnce(ERROR_MESSAGE)
      const usecase = new TaskUseCase(mockTaskRepo, mockUserBelongTaskRepo)
      return expect(
        usecase.changeTaskGroup({
          taskId: '1',
          taskGroupId: '1',
        }),
      ).rejects.toEqual(ERROR_MESSAGE)
    })
  })

  describe('delete', () => {
    it('[正常系]: 例外が発生しない', async () => {
      const usecase = new TaskUseCase(mockTaskRepo, mockUserBelongTaskRepo)
      return expect(usecase.delete({ taskId: '1' })).resolves.toBe(undefined)
    })
    it('[準正常系]: deleteで例外が発生した場合、例外が発生する', () => {
      const ERROR_MESSAGE = 'error!'
      mockUserRepo.save.mockRejectedValueOnce(ERROR_MESSAGE)
      const usecase = new TaskUseCase(mockTaskRepo, mockUserBelongTaskRepo)
      return expect(usecase.delete({ taskId: '1' })).rejects.toEqual(
        ERROR_MESSAGE,
      )
    })
  })
})
