import { PrismaClient } from '@prisma/client'
import { mocked } from 'ts-jest/utils'
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing'
import { UserRepository } from 'src/infra/db/repository/user-repository'
import { TaskRepository } from 'src/infra/db/repository/task-repository'
import { UserBelongTaskRepository } from 'src/infra/db/repository/user-belong-task-repository'
import { TaskGroupService } from 'src/domain/entity/task-group/task-group-service'
import { TaskGroupRepository } from 'src/infra/db/repository/task-group-repository'
import { TaskGroupUseCase } from '../task-group-usecase'

jest.mock('@prisma/client')
jest.mock('src/infra/db/repository/user-repository')

describe('task-group-usecase.ts', () => {
  let mockUserRepo: MockedObjectDeep<UserRepository>
  let mockTaskRepo: MockedObjectDeep<TaskRepository>
  let mockTaskGroupRepo: MockedObjectDeep<TaskGroupRepository>
  let mockTaskGroupService: MockedObjectDeep<TaskGroupService>
  let mockUserBelongTaskRepo: MockedObjectDeep<UserBelongTaskRepository>

  beforeAll(() => {
    const prisma = new PrismaClient()
    mockUserRepo = mocked(new UserRepository(prisma), true)
    mockTaskRepo = mocked(new TaskRepository(prisma), true)
    mockTaskGroupRepo = mocked(new TaskGroupRepository(prisma), true)
    mockUserBelongTaskRepo = mocked(new UserBelongTaskRepository(prisma), true)
    mockTaskGroupService = mocked(
      new TaskGroupService({
        taskGroupRepository: mockTaskGroupRepo,
        taskRepository: mockTaskRepo,
        userBelongTaskRepository: mockUserBelongTaskRepo,
      }),
      true,
    )
  })
  describe('findAll', () => {
    const usecase = new TaskGroupUseCase(
      mockTaskGroupRepo,
      mockTaskGroupService,
    )
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
      const usecase = new TaskGroupUseCase(
        mockTaskGroupRepo,
        mockTaskGroupService,
      )
      return expect(
        usecase.create({
          name: 'task1',
          taskIds: ['1', '2'],
        }),
      ).resolves.toBe(undefined)
    })
    it('[準正常系]: createで例外が発生した場合、例外が発生する', () => {
      const ERROR_MESSAGE = 'error!'
      mockUserRepo.save.mockRejectedValueOnce(ERROR_MESSAGE)
      const usecase = new TaskGroupUseCase(
        mockTaskGroupRepo,
        mockTaskGroupService,
      )
      return expect(
        usecase.create({
          name: 'task1',
          taskIds: ['1', '2'],
        }),
      ).rejects.toEqual(ERROR_MESSAGE)
    })
  })

  describe('changeName', () => {
    it('[正常系]: 例外が発生しない', async () => {
      const usecase = new TaskGroupUseCase(
        mockTaskGroupRepo,
        mockTaskGroupService,
      )
      return expect(
        usecase.changeName({
          taskGroupId: '1',
          name: 'name1',
        }),
      ).resolves.toBe(undefined)
    })
    it('[準正常系]: changeNameで例外が発生した場合、例外が発生する', () => {
      const ERROR_MESSAGE = 'error!'
      mockUserRepo.save.mockRejectedValueOnce(ERROR_MESSAGE)
      const usecase = new TaskGroupUseCase(
        mockTaskGroupRepo,
        mockTaskGroupService,
      )
      return expect(
        usecase.changeName({
          taskGroupId: '1',
          name: 'name1',
        }),
      ).rejects.toEqual(ERROR_MESSAGE)
    })
  })

  describe('delete', () => {
    it('[正常系]: 例外が発生しない', async () => {
      const usecase = new TaskGroupUseCase(
        mockTaskGroupRepo,
        mockTaskGroupService,
      )
      return expect(usecase.delete({ taskGroupId: '1' })).resolves.toBe(
        undefined,
      )
    })
    it('[準正常系]: deleteで例外が発生した場合、例外が発生する', () => {
      const ERROR_MESSAGE = 'error!'
      mockUserRepo.save.mockRejectedValueOnce(ERROR_MESSAGE)
      const usecase = new TaskGroupUseCase(
        mockTaskGroupRepo,
        mockTaskGroupService,
      )
      return expect(usecase.delete({ taskGroupId: '1' })).rejects.toEqual(
        ERROR_MESSAGE,
      )
    })
  })
})
