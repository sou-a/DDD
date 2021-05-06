import { PrismaClient } from '@prisma/client'
import { mocked } from 'ts-jest/utils'
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing'
import { UserRepository } from 'src/infra/db/repository/user-repository'
import { TeamUseCase } from '../team-usecase'
import { TeamRepository } from 'src/infra/db/repository/team-repository'
import { TeamService } from 'src/domain/entity/team/team-service'
import { TeamFactory } from 'src/domain/entity/team/team-factory'

jest.mock('@prisma/client')
jest.mock('src/infra/db/repository/user-repository')

describe('team-usecase.ts', () => {
  let mockUserRepo: MockedObjectDeep<UserRepository>
  let mockTeamRepo: MockedObjectDeep<TeamRepository>
  let mockTeamService: MockedObjectDeep<TeamService>
  let mockTeamFactory: MockedObjectDeep<TeamFactory>
  beforeAll(() => {
    const prisma = new PrismaClient()
    mockUserRepo = mocked(new UserRepository(prisma), true)
    mockTeamRepo = mocked(new TeamRepository(prisma), true)
    mockTeamService = mocked(
      new TeamService({
        teamRepository: mockTeamRepo,
      }),
      true,
    )
    mockTeamFactory = mocked(
      new TeamFactory({
        teamRepository: mockTeamRepo,
      }),
      true,
    )
  })
  describe('findAll', () => {
    const usecase = new TeamUseCase(
      mockTeamRepo,
      mockUserRepo,
      mockTeamService,
      mockTeamFactory,
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
      const usecase = new TeamUseCase(
        mockTeamRepo,
        mockUserRepo,
        mockTeamService,
        mockTeamFactory,
      )
      return expect(
        usecase.create({
          name: 'team1',
          userIds: ['1', '2'],
        }),
      ).resolves.toBe(undefined)
    })
    it('[準正常系]: createで例外が発生した場合、例外が発生する', () => {
      const ERROR_MESSAGE = 'error!'
      mockUserRepo.save.mockRejectedValueOnce(ERROR_MESSAGE)
      const usecase = new TeamUseCase(
        mockTeamRepo,
        mockUserRepo,
        mockTeamService,
        mockTeamFactory,
      )
      return expect(
        usecase.create({
          name: 'team1',
          userIds: ['1', '2'],
        }),
      ).rejects.toEqual(ERROR_MESSAGE)
    })
  })

  describe('createTeamUser', () => {
    it('[正常系]: 例外が発生しない', async () => {
      const usecase = new TeamUseCase(
        mockTeamRepo,
        mockUserRepo,
        mockTeamService,
        mockTeamFactory,
      )
      return expect(
        usecase.createTeamUser({ teamId: '1', userId: '1' }),
      ).resolves.toBe(undefined)
    })
    it('[準正常系]: createTeamUserで例外が発生した場合、例外が発生する', () => {
      const ERROR_MESSAGE = 'error!'
      mockUserRepo.save.mockRejectedValueOnce(ERROR_MESSAGE)
      const usecase = new TeamUseCase(
        mockTeamRepo,
        mockUserRepo,
        mockTeamService,
        mockTeamFactory,
      )
      return expect(
        usecase.createTeamUser({ teamId: '1', userId: '1' }),
      ).rejects.toEqual(ERROR_MESSAGE)
    })
  })

  describe('deleteTeamUser', () => {
    it('[正常系]: 例外が発生しない', async () => {
      const usecase = new TeamUseCase(
        mockTeamRepo,
        mockUserRepo,
        mockTeamService,
        mockTeamFactory,
      )
      return expect(
        usecase.deleteTeamUser({ teamId: '1', userId: '1' }),
      ).resolves.toBe(undefined)
    })
    it('[準正常系]: deleteTeamUserで例外が発生した場合、例外が発生する', () => {
      const ERROR_MESSAGE = 'error!'
      mockUserRepo.save.mockRejectedValueOnce(ERROR_MESSAGE)
      const usecase = new TeamUseCase(
        mockTeamRepo,
        mockUserRepo,
        mockTeamService,
        mockTeamFactory,
      )
      return expect(
        usecase.deleteTeamUser({ teamId: '1', userId: '1' }),
      ).rejects.toEqual(ERROR_MESSAGE)
    })
  })

  describe('delete', () => {
    it('[正常系]: 例外が発生しない', async () => {
      const usecase = new TeamUseCase(
        mockTeamRepo,
        mockUserRepo,
        mockTeamService,
        mockTeamFactory,
      )
      return expect(usecase.delete({ teamId: '1' })).resolves.toBe(undefined)
    })
    it('[準正常系]: deleteで例外が発生した場合、例外が発生する', () => {
      const ERROR_MESSAGE = 'error!'
      mockUserRepo.save.mockRejectedValueOnce(ERROR_MESSAGE)
      const usecase = new TeamUseCase(
        mockTeamRepo,
        mockUserRepo,
        mockTeamService,
        mockTeamFactory,
      )
      return expect(usecase.delete({ teamId: '1' })).rejects.toEqual(
        ERROR_MESSAGE,
      )
    })
  })
})
