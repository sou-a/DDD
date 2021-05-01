import { PrismaClient } from '@prisma/client'
import { UserUseCase } from '../user-usecase'
import { mocked } from 'ts-jest/utils'
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing'
import { UserRepository } from 'src/infra/db/repository/user-repository'
import { UserService } from 'src/domain/entity/user/user-service'
import { TeamService } from 'src/domain/entity/team/team-service'
import { PairRepository } from 'src/infra/db/repository/pair-repository'
import { TeamRepository } from 'src/infra/db/repository/team-repository'

jest.mock('@prisma/client')
jest.mock('src/infra/db/repository/user-repository')

describe('findAll', () => {
  let mockUserRepo: MockedObjectDeep<UserRepository>
  let mockPairRepo: MockedObjectDeep<PairRepository>
  let mockTeamRepo: MockedObjectDeep<TeamRepository>
  let mockTeamService: MockedObjectDeep<TeamService>
  let mockUserService: MockedObjectDeep<UserService>
  beforeAll(() => {
    const prisma = new PrismaClient()
    mockUserRepo = mocked(new UserRepository(prisma), true)
    mockUserService = mocked(new UserRepository(prisma), true)
  })
  it('[正常系]: 例外が発生しない', async () => {
    const usecase = new UserUseCase(mockUserRepo, mockUserService)
    return expect(usecase.findAll()).resolves.toBe(undefined)
  })
  it('[異常系]: someDataRepo.saveで例外が発生した場合、例外が発生する', () => {
    const ERROR_MESSAGE = 'error!'
    mockUserRepo.save.mockRejectedValueOnce(ERROR_MESSAGE)
    const usecase = new UserUseCase(mockUserRepo, mockUserService)
    return expect(usecase.findAll()).rejects.toEqual(ERROR_MESSAGE)
  })
})
