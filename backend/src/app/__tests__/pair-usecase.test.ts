import { PrismaClient } from '@prisma/client'
import { mocked } from 'ts-jest/utils'
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing'
import { UserRepository } from 'src/infra/db/repository/user-repository'
import { PairRepository } from 'src/infra/db/repository/pair-repository'
import { PairUseCase } from '../pair-usecase'

jest.mock('@prisma/client')
jest.mock('src/infra/db/repository/user-repository')

describe('pair-usecase.ts', () => {
  let mockUserRepo: MockedObjectDeep<UserRepository>
  let mockPairRepo: MockedObjectDeep<PairRepository>
  beforeAll(() => {
    const prisma = new PrismaClient()
    mockUserRepo = mocked(new UserRepository(prisma), true)
    mockPairRepo = mocked(new PairRepository(prisma), true)
  })
  describe('findAll', () => {
    const usecase = new PairUseCase(mockPairRepo, mockUserRepo)
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
      const usecase = new PairUseCase(mockPairRepo, mockUserRepo)
      return expect(
        usecase.create({
          name: 'pair1',
          userIds: ['1', '2'],
        }),
      ).resolves.toBe(undefined)
    })
    it('[準正常系]: createで例外が発生した場合、例外が発生する', () => {
      const ERROR_MESSAGE = 'error!'
      mockUserRepo.save.mockRejectedValueOnce(ERROR_MESSAGE)
      const usecase = new PairUseCase(mockPairRepo, mockUserRepo)
      return expect(
        usecase.create({
          name: 'pair1',
          userIds: ['1', '2'],
        }),
      ).rejects.toEqual(ERROR_MESSAGE)
    })
  })

  describe('addPairUser', () => {
    it('[正常系]: 例外が発生しない', async () => {
      const usecase = new PairUseCase(mockPairRepo, mockUserRepo)
      return expect(
        usecase.addPairUser({ pairId: '1', userId: '1' }),
      ).resolves.toBe(undefined)
    })
    it('[準正常系]: addPairUserで例外が発生した場合、例外が発生する', () => {
      const ERROR_MESSAGE = 'error!'
      mockUserRepo.save.mockRejectedValueOnce(ERROR_MESSAGE)
      const usecase = new PairUseCase(mockPairRepo, mockUserRepo)
      return expect(
        usecase.addPairUser({ pairId: '1', userId: '1' }),
      ).rejects.toEqual(ERROR_MESSAGE)
    })
  })

  describe('removePairUser', () => {
    it('[正常系]: 例外が発生しない', async () => {
      const usecase = new PairUseCase(mockPairRepo, mockUserRepo)
      return expect(
        usecase.removePairUser({ pairId: '1', userId: '1' }),
      ).resolves.toBe(undefined)
    })
    it('[準正常系]: removePairUserで例外が発生した場合、例外が発生する', () => {
      const ERROR_MESSAGE = 'error!'
      mockUserRepo.save.mockRejectedValueOnce(ERROR_MESSAGE)
      const usecase = new PairUseCase(mockPairRepo, mockUserRepo)
      return expect(
        usecase.removePairUser({ pairId: '1', userId: '1' }),
      ).rejects.toEqual(ERROR_MESSAGE)
    })
  })

  describe('delete', () => {
    it('[正常系]: 例外が発生しない', async () => {
      const usecase = new PairUseCase(mockPairRepo, mockUserRepo)
      return expect(usecase.delete({ pairId: '1' })).resolves.toBe(undefined)
    })
    it('[準正常系]: deleteで例外が発生した場合、例外が発生する', () => {
      const ERROR_MESSAGE = 'error!'
      mockUserRepo.save.mockRejectedValueOnce(ERROR_MESSAGE)
      const usecase = new PairUseCase(mockPairRepo, mockUserRepo)
      return expect(usecase.delete({ pairId: '1' })).rejects.toEqual(
        ERROR_MESSAGE,
      )
    })
  })
})
