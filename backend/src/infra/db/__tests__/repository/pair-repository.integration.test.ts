import { createRandomIdString } from 'src/util/random'
import { prisma } from '@testUtil/prisma'
import { PairRepository } from '../../repository/pair-repository'
import { Pair } from 'src/domain/entity/pair/pair'
import { seedUser } from '@testUtil/user/seed-user'
import { seedAllUserStatus } from '@testUtil/user-status-factory'
import { seedPair, seedPairUser } from '@testUtil/pair/seed-pair'

describe('pair-repository.integration.ts', () => {
  const pairRepo = new PairRepository(prisma)
  beforeAll(async () => {
    await prisma.pair.deleteMany()
  })
  afterAll(async () => {
    await prisma.pairUser.deleteMany()
    await prisma.user.deleteMany()
    await prisma.userStatus.deleteMany()
    await prisma.pair.deleteMany()

    await prisma.$disconnect()
  })
  beforeEach(async () => {
    await prisma.pairUser.deleteMany()
    await prisma.user.deleteMany()
    await prisma.userStatus.deleteMany()
    await prisma.pair.deleteMany()
  })

  describe('findAll', () => {
    it('[正常系]pairを全て取得できる', async () => {
      await seedAllUserStatus()
      await seedUser({ id: '1' })
      await seedUser({ id: '2' })
      await seedPair({ id: '1' })
      await seedPairUser({ userId: '1', pairId: '1' })
      await seedPairUser({ userId: '2', pairId: '1' })

      const pair = await pairRepo.findAll()
      expect(pair).toHaveLength(1)
      expect(pair[0]?.getAllProperties().pairUsers).toHaveLength(2)
    })
  })

  describe('findById', () => {
    it('[正常系]特定のidのpairを取得できる', async () => {
      await seedAllUserStatus()
      await seedUser({ id: '1' })
      await seedUser({ id: '2' })
      await seedPair({ id: '1' })
      await seedPairUser({ userId: '1', pairId: '1' })
      await seedPairUser({ userId: '2', pairId: '1' })

      const pair = await pairRepo.findById('1')
      expect(pair).toEqual(expect.any(Pair))
    })
  })

  describe('findByUserId', () => {
    it('[正常系]特定のuserIdのpairを取得できる', async () => {
      await seedAllUserStatus()
      await seedUser({ id: '1' })
      await seedUser({ id: '2' })
      await seedPair({ id: '1' })
      await seedPairUser({ userId: '1', pairId: '1' })
      await seedPairUser({ userId: '2', pairId: '1' })

      const pair = await pairRepo.findByUserId('1')
      expect(pair).toEqual(expect.any(Pair))
      expect(pair?.getAllProperties().id).toEqual('1')
    })
  })

  describe('save', () => {
    it('[正常系]pairを保存できる', async () => {
      await seedAllUserStatus()
      const user1 = await seedUser({ id: '1' })
      const user2 = await seedUser({ id: '2' })
      const pairExpected = {
        id: createRandomIdString(),
        name: 'a',
        users: [user1, user2],
      }

      let allPairs = await prisma.pair.findMany()
      expect(allPairs).toHaveLength(0)

      await pairRepo.save(new Pair(pairExpected))

      allPairs = await prisma.pair.findMany()
      expect(allPairs).toHaveLength(1)
    })
  })

  describe('delete', () => {
    it('[正常系]特定のidのpairを削除できる', async () => {
      await seedAllUserStatus()
      await seedUser({ id: '1' })
      await seedUser({ id: '2' })
      await seedUser({ id: '3' })
      await seedUser({ id: '4' })
      await seedPair({ id: '1' })
      await seedPair({ id: '2' })
      await seedPairUser({ userId: '1', pairId: '1' })
      await seedPairUser({ userId: '2', pairId: '1' })
      await seedPairUser({ userId: '3', pairId: '2' })
      await seedPairUser({ userId: '4', pairId: '2' })

      let allPairs = await prisma.pair.findMany()
      expect(allPairs).toHaveLength(2)
      await pairRepo.delete('1')
      allPairs = await prisma.pair.findMany()
      expect(allPairs).toHaveLength(1)
    })
  })

  describe('deletePairUser', () => {
    it('[正常系]特定のidのpairUserを削除できる', async () => {
      await seedAllUserStatus()
      await seedUser({ id: '1' })
      await seedUser({ id: '2' })
      await seedUser({ id: '3' })
      await seedPair({ id: '1' })
      await seedPairUser({ userId: '1', pairId: '1' })
      await seedPairUser({ userId: '2', pairId: '1' })
      await seedPairUser({ userId: '3', pairId: '1' })

      let allPairs = await prisma.pair.findFirst({
        include: {
          users: true,
        },
      })
      expect(allPairs?.users).toHaveLength(3)
      await pairRepo.deletePairUser('1')
      allPairs = await prisma.pair.findFirst({
        include: {
          users: true,
        },
      })
      expect(allPairs?.users).toHaveLength(2)
    })
  })
})
