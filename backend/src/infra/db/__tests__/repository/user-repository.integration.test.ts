import { createRandomIdString } from 'src/util/random'
import { prisma } from '@testUtil/prisma'
import { UserRepository } from '../../repository/user-repository'
import { User } from 'src/domain/entity/user/user'
import { UserStatus } from 'src/domain/valueOblect/user-status'

describe('user-repository.ts', () => {
  const userRepo = new UserRepository(prisma)
  beforeAll(async () => {
    await prisma.user.deleteMany({})
  })
  afterAll(async () => {
    await prisma.$disconnect()
  })

  describe('findAll', () => {
    afterEach(async () => {
      await prisma.user.deleteMany({})
    })
    it('[正常系]userを全て取得できる', async () => {
      const usersExpected = [
        {
          id: createRandomIdString(),
          userStatusId: '1',
          name: 'user1',
          mailAddress: 'sample@example.com',
        },
        {
          id: createRandomIdString(),
          userStatusId: '1',
          name: 'user2',
          mailAddress: 'sample@example.com',
        },
      ]
      await prisma.user.createMany({ data: usersExpected })
      expect(await userRepo.findAll()).toHaveLength(2)
    })
  })

  describe('findById', () => {
    afterEach(async () => {
      await prisma.user.deleteMany({})
    })
    it('[正常系]特定のidのuserを取得できる', async () => {
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
          mailAddress: 'sample@example.com',
        },
      ]
      await prisma.user.createMany({ data: usersExpected })
      expect(await userRepo.findById('1')).toHaveLength(1)
    })
  })

  describe('save', () => {
    afterEach(async () => {
      await prisma.user.deleteMany({})
    })
    it('[正常系]userを保存できる', async () => {
      const userExpected = {
        id: createRandomIdString(),
        name: 'user1',
        mailAddress: 'sample@example.com',
        status: new UserStatus(UserStatus.active),
      }
      await userRepo.save(new User(userExpected))

      const allUsers = await prisma.user.findMany({})
      expect(allUsers).toHaveLength(1)
      expect(allUsers[0]).toEqual(userExpected)
    })
  })

  describe('delete', () => {
    afterEach(async () => {
      await prisma.user.deleteMany({})
    })
    it('[正常系]特定のidのuserを削除できる', async () => {
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
          mailAddress: 'sample@example.com',
        },
      ]
      await prisma.user.createMany({ data: usersExpected })
      await userRepo.delete('1')
      const allUsers = await prisma.user.findMany({})
      expect(allUsers).toHaveLength(1)
    })
  })
})
