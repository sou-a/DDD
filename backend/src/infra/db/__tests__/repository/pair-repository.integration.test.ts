import { createRandomIdString } from 'src/util/random'
import { prisma } from '@testUtil/prisma'
import { PairRepository } from '../../repository/pair-repository'
import { Pair } from 'src/domain/entity/pair/pair'
import { createUser } from '@testUtil/user/user-factory'

describe('pair-repository.ts', () => {
  const pairRepo = new PairRepository(prisma)
  beforeAll(async () => {
    await prisma.pair.deleteMany({})
  })
  afterAll(async () => {
    await prisma.$disconnect()
  })

  describe('findAll', () => {
    afterEach(async () => {
      await prisma.pair.deleteMany({})
    })
    it('[正常系]pairを全て取得できる', async () => {
      const pairsExpected = [
        {
          id: createRandomIdString(),
          name: 'a',
        },
        {
          id: createRandomIdString(),
          name: 'b',
        },
      ]
      await prisma.pair.createMany({ data: pairsExpected })
      expect(await pairRepo.findAll()).toHaveLength(2)
    })
  })

  describe('findById', () => {
    afterEach(async () => {
      await prisma.pair.deleteMany({})
    })
    it('[正常系]特定のidのpairを取得できる', async () => {
      const pairsExpected = [
        {
          id: '1',
          name: 'a',
        },
        {
          id: '2',
          name: 'b',
        },
      ]
      await prisma.pair.createMany({ data: pairsExpected })
      expect(await pairRepo.findById('1')).toHaveLength(1)
    })
  })

  describe('findByUserId', () => {
    afterEach(async () => {
      await prisma.pair.deleteMany({})
    })
    it('[正常系]特定のuserIdのpairを取得できる', async () => {
      const pairExpected = [
        {
          id: '1',
          name: 'a',
        },
      ]
      const usersExpected = [
        {
          id: '1',
          userStatusId: '1',
          name: 'user1',
          mailAddress: 'sample@example.com',
        },
        {
          id: '2',
          userStatusId: '1',
          name: 'user2',
          mailAddress: '2sample@example.com',
        },
      ]
      const pairUsersExpected = [
        {
          pairId: '1',
          userId: '1',
        },
        {
          pairId: '1',
          userId: '2',
        },
      ]
      await prisma.pair.createMany({ data: pairExpected })
      await prisma.user.createMany({ data: usersExpected })
      await prisma.pairUser.createMany({ data: pairUsersExpected })
      expect(await pairRepo.findByUserId('1')).toHaveLength(1)
    })
  })

  describe('save', () => {
    afterEach(async () => {
      await prisma.pair.deleteMany({})
    })
    it('[正常系]pairを保存できる', async () => {
      const pairExpected = {
        id: createRandomIdString(),
        name: 'user1',
        users: [createUser({}), createUser({})],
      }
      await pairRepo.save(new Pair(pairExpected))

      const allPairs = await prisma.pair.findMany({})
      expect(allPairs).toHaveLength(1)
      expect(allPairs[0]).toEqual(pairExpected)
    })
  })

  describe('delete', () => {
    afterEach(async () => {
      await prisma.pair.deleteMany({})
    })
    it('[正常系]特定のidのpairを削除できる', async () => {
      const pairsExpected = [
        {
          id: '1',
          name: 'user1',
        },
        {
          id: '2',
          name: 'user2',
        },
      ]
      await prisma.pair.createMany({ data: pairsExpected })
      await pairRepo.delete('1')
      const allPairs = await prisma.pair.findMany({})
      expect(allPairs).toHaveLength(1)
    })
  })

  describe('deletePairUser', () => {
    afterEach(async () => {
      await prisma.pair.deleteMany({})
    })
    it('[正常系]特定のidのpairUserを削除できる', async () => {
      const pairExpected = [
        {
          id: '1',
          name: 'a',
        },
      ]
      const usersExpected = [
        {
          id: '1',
          userStatusId: '1',
          name: 'user1',
          mailAddress: 'sample@example.com',
        },
        {
          id: '2',
          userStatusId: '1',
          name: 'user2',
          mailAddress: '2sample@example.com',
        },
      ]
      const pairUsersExpected = [
        {
          pairId: '1',
          userId: '1',
        },
        {
          pairId: '1',
          userId: '2',
        },
      ]
      await prisma.pair.createMany({ data: pairExpected })
      await prisma.user.createMany({ data: usersExpected })
      await prisma.pairUser.createMany({ data: pairUsersExpected })
      await pairRepo.deletePairUser('1')
      const allPairs = await prisma.pairUser.findMany({})
      expect(allPairs).toHaveLength(1)
    })
  })
})
