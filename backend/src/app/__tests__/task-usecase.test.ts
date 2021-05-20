import { PrismaClient } from '@prisma/client'
import { mocked } from 'ts-jest/utils'
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing'
import { TaskRepository } from 'src/infra/db/repository/task-repository'
import { UserBelongTaskRepository } from 'src/infra/db/repository/user-belong-task-repository'
import { TaskUseCase } from '../task-usecase'
import { TaskStatus } from 'src/domain/valueOblect/task-status'
import { createTask } from '@testUtil/task/task-factory'
import { createUserBelongTask } from '@testUtil/user-belong-task/user-belong-task-factory'
import { TaskDTO, UserBelongTaskDTO } from '../dto/task-dto'

jest.mock('@prisma/client')
jest.mock('src/infra/db/repository/task-repository')
jest.mock('src/infra/db/repository/user-belong-task-repository')

describe('task-usecase.ts', () => {
  let mockTaskRepo: MockedObjectDeep<TaskRepository>
  let mockUserBelongTaskRepo: MockedObjectDeep<UserBelongTaskRepository>
  beforeAll(() => {
    const prisma = new PrismaClient()
    mockTaskRepo = mocked(new TaskRepository(prisma), true)
    mockUserBelongTaskRepo = mocked(new UserBelongTaskRepository(prisma), true)
  })
  describe('findAll', () => {
    it('[正常系]: DTOを返す', async () => {
      const usecase = new TaskUseCase(mockTaskRepo, mockUserBelongTaskRepo)
      mockTaskRepo.findAll.mockResolvedValueOnce([
        createTask({}),
        createTask({}),
      ])

      const taskDTOs = await usecase.findAll()
      taskDTOs.map((taskDTO) => {
        return expect(taskDTO).toEqual(expect.any(TaskDTO))
      })
    })
    it('[準正常系]: findAllで例外が発生した場合、例外が発生する', () => {
      const usecase = new TaskUseCase(mockTaskRepo, mockUserBelongTaskRepo)
      const ERROR_MESSAGE = 'error!'
      mockTaskRepo.findAll.mockRejectedValueOnce(ERROR_MESSAGE)

      return expect(usecase.findAll()).rejects.toEqual(ERROR_MESSAGE)
    })
  })

  describe('create', () => {
    it('[正常系]: 例外が発生しない', async () => {
      const usecase = new TaskUseCase(mockTaskRepo, mockUserBelongTaskRepo)
      mockTaskRepo.save.mockResolvedValueOnce(createTask({}))

      return expect(
        usecase.create({
          taskGroupId: '1',
          name: 'task1',
        }),
      ).resolves.toEqual(expect.any(TaskDTO))
    })
    it('[準正常系]: saveで例外が発生した場合、例外が発生する', () => {
      const ERROR_MESSAGE = 'error!'
      mockTaskRepo.save.mockRejectedValueOnce(ERROR_MESSAGE)
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
      mockUserBelongTaskRepo.findByUserIdAndTaskId.mockResolvedValueOnce(
        createUserBelongTask({ userId: '1' }),
      )
      mockUserBelongTaskRepo.save.mockResolvedValueOnce(
        createUserBelongTask({}),
      )
      return expect(
        usecase.changeStatus({
          userId: '1',
          taskId: '1',
          status: TaskStatus.review,
        }),
      ).resolves.toEqual(expect.any(UserBelongTaskDTO))
    })
    it('[準正常系]: saveで例外が発生した場合、例外が発生する', () => {
      const ERROR_MESSAGE = 'error!'
      mockUserBelongTaskRepo.findByUserIdAndTaskId.mockResolvedValueOnce(
        createUserBelongTask({ userId: '1' }),
      )
      mockUserBelongTaskRepo.save.mockRejectedValueOnce(ERROR_MESSAGE)
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
      mockTaskRepo.findById.mockResolvedValueOnce(createTask({}))
      mockTaskRepo.save.mockResolvedValueOnce(createTask({}))

      return expect(
        usecase.changeTaskGroup({
          taskId: '1',
          taskGroupId: '1',
        }),
      ).resolves.toEqual(expect.any(TaskDTO))
    })
    it('[準正常系]: changeTaskGroupで例外が発生した場合、例外が発生する', () => {
      const ERROR_MESSAGE = 'error!'
      mockTaskRepo.findById.mockResolvedValueOnce(createTask({}))
      mockTaskRepo.save.mockRejectedValueOnce(ERROR_MESSAGE)

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
      mockTaskRepo.delete.mockResolvedValueOnce()

      return expect(usecase.delete({ taskId: '1' })).resolves.toBe(undefined)
    })
    it('[準正常系]: deleteで例外が発生した場合、例外が発生する', () => {
      const ERROR_MESSAGE = 'error!'
      mockTaskRepo.delete.mockRejectedValueOnce(ERROR_MESSAGE)
      const usecase = new TaskUseCase(mockTaskRepo, mockUserBelongTaskRepo)

      return expect(usecase.delete({ taskId: '1' })).rejects.toEqual(
        ERROR_MESSAGE,
      )
    })
  })
})
