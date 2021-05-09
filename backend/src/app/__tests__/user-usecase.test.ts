import { PrismaClient } from '@prisma/client'
import { UserUseCase } from '../user-usecase'
import { mocked } from 'ts-jest/utils'
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing'
import { UserRepository } from 'src/infra/db/repository/user-repository'
import { UserService } from 'src/domain/entity/user/user-service'
import { TeamService } from 'src/domain/entity/team/team-service'
import { PairRepository } from 'src/infra/db/repository/pair-repository'
import { TeamRepository } from 'src/infra/db/repository/team-repository'
import { UserStatus } from 'src/domain/valueOblect/user-status'
import { UserQS } from 'src/infra/db/query-service/user-qs'

jest.mock('@prisma/client')
jest.mock('src/infra/db/repository/user-repository')

describe('user-usecase.ts', () => {
  let mockUserRepo: MockedObjectDeep<UserRepository>
  let mockPairRepo: MockedObjectDeep<PairRepository>
  let mockTeamRepo: MockedObjectDeep<TeamRepository>
  let mockTeamService: MockedObjectDeep<TeamService>
  let mockUserService: MockedObjectDeep<UserService>
  let mockUserQS: MockedObjectDeep<UserQS>
  beforeAll(() => {
    const prisma = new PrismaClient()
    mockUserRepo = mocked(new UserRepository(prisma), true)
    mockUserService = mocked(
      new UserService({
        userRepository: mockUserRepo,
        pairRepository: mockPairRepo,
        teamRepository: mockTeamRepo,
        teamService: mockTeamService,
      }),
      true,
    )
  })
  describe('findAll', () => {
    const usecase = new UserUseCase(mockUserRepo, mockUserService, mockUserQS)
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
      const usecase = new UserUseCase(mockUserRepo, mockUserService, mockUserQS)
      return expect(
        usecase.create({
          name: 'user1',
          mailAddress: 'mail1',
          status: UserStatus.active,
        }),
      ).resolves.toBe(undefined)
    })
    it('[準正常系]: createで例外が発生した場合、例外が発生する', () => {
      const ERROR_MESSAGE = 'error!'
      mockUserRepo.save.mockRejectedValueOnce(ERROR_MESSAGE)
      const usecase = new UserUseCase(mockUserRepo, mockUserService, mockUserQS)
      return expect(
        usecase.create({
          name: 'user1',
          mailAddress: 'mail1',
          status: UserStatus.active,
        }),
      ).rejects.toEqual(ERROR_MESSAGE)
    })
  })

  describe('changeStatus', () => {
    it('[正常系]: 例外が発生しない', async () => {
      const usecase = new UserUseCase(mockUserRepo, mockUserService, mockUserQS)
      return expect(
        usecase.changeStatus({ userId: '1', status: UserStatus.leave }),
      ).resolves.toBe(undefined)
    })
    it('[準正常系]: changeStatusで例外が発生した場合、例外が発生する', () => {
      const ERROR_MESSAGE = 'error!'
      mockUserRepo.save.mockRejectedValueOnce(ERROR_MESSAGE)
      const usecase = new UserUseCase(mockUserRepo, mockUserService, mockUserQS)
      return expect(
        usecase.changeStatus({ userId: '1', status: UserStatus.leave }),
      ).rejects.toEqual(ERROR_MESSAGE)
    })
  })

  describe('delete', () => {
    it('[正常系]: 例外が発生しない', async () => {
      const usecase = new UserUseCase(mockUserRepo, mockUserService, mockUserQS)
      return expect(usecase.delete({ userId: '1' })).resolves.toBe(undefined)
    })
    it('[準正常系]: deleteで例外が発生した場合、例外が発生する', () => {
      const ERROR_MESSAGE = 'error!'
      mockUserRepo.save.mockRejectedValueOnce(ERROR_MESSAGE)
      const usecase = new UserUseCase(mockUserRepo, mockUserService, mockUserQS)
      return expect(usecase.delete({ userId: '1' })).rejects.toEqual(
        ERROR_MESSAGE,
      )
    })
  })
})
