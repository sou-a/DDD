import { mocked } from 'ts-jest/utils'
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing'
import { PrismaClient } from '@prisma/client'
import { TaskGroupService } from 'src/domain/entity/task-group/task-group-service'
import { TaskRepository } from 'src/infra/db/repository/task-repository'
import { TaskGroupRepository } from 'src/infra/db/repository/task-group-repository'
import { UserBelongTaskRepository } from 'src/infra/db/repository/user-belong-task-repository'
import { TaskGroup } from 'src/domain/entity/task-group/task-group'
import { createRandomIdString } from 'src/util/random'

jest.mock('@prisma/client')
jest.mock('src/infra/db/repository/task-repository')
jest.mock('src/infra/db/repository/task-group-repository')
jest.mock('src/infra/db/repository/user-belong-task-repository')

describe('task-group-service.ts', () => {
  describe('delete', () => {
    let mockTaskRepo: MockedObjectDeep<TaskRepository>
    let mockTaskGroupRepo: MockedObjectDeep<TaskGroupRepository>
    let mockUserBelongTaskRepo: MockedObjectDeep<UserBelongTaskRepository>
    beforeAll(() => {
      const prisma = new PrismaClient()
      mockTaskRepo = mocked(new TaskRepository(prisma), true)
      mockTaskGroupRepo = mocked(new TaskGroupRepository(prisma), true)
      mockUserBelongTaskRepo = mocked(
        new UserBelongTaskRepository(prisma),
        true,
      )
    })
    it('[正常系]タスクを削除したとき関連する中間テーブルからも削除する', async () => {
      const taskGroupService = new TaskGroupService({
        taskRepository: mockTaskRepo,
        taskGroupRepository: mockTaskGroupRepo,
        userBelongTaskRepository: mockUserBelongTaskRepo,
      })

      taskGroupService.delete(
        new TaskGroup({
          id: createRandomIdString(),
          name: 'A',
          tasks: ['1', '2'],
        }),
      )
    })
  })
})
