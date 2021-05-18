import { createRandomIdString } from 'src/util/random'
import { prisma } from '@testUtil/prisma'
import { UserRepository } from '../../repository/user-repository'
import { User } from 'src/domain/entity/user/user'
import { UserStatus } from 'src/domain/valueOblect/user-status'
import { seedAllUserStatus } from '@testUtil/user-status-factory'
import { seedUser } from '@testUtil/user/seed-user'
// import { resetDatabase } from '@testUtil/resetDB'

describe('user-repository.integration.ts', () => {
  const userRepo = new UserRepository(prisma)
  beforeEach(async () => {
    // 5s
    await prisma.user.deleteMany()
    await prisma.userStatus.deleteMany()

    // 11s
    // await resetDatabase()
  })
  afterAll(async () => {
    await prisma.user.deleteMany()
    await prisma.userStatus.deleteMany()

    await prisma.$disconnect()
  })

  describe('findAll', () => {
    it('[正常系]userを全て取得できる', async () => {
      await seedAllUserStatus()
      await seedUser({})
      await seedUser({})
      const users = await userRepo.findAll()
      expect(users).toHaveLength(2)
    })
  })

  describe('findById', () => {
    it('[正常系]特定のidのuserを取得できる', async () => {
      await seedAllUserStatus()
      await seedUser({ id: '1' })
      await seedUser({ id: '2' })
      const user = await userRepo.findById('1')
      expect(user).toEqual(expect.any(User))
    })
  })

  describe.skip('save', () => {
    it('[正常系]userを保存できる', async () => {
      const userExpected = {
        id: createRandomIdString(),
        name: 'user1',
        mailAddress: 'sample@example.com',
        status: new UserStatus(UserStatus.active),
      }
      await userRepo.save(new User(userExpected))

      const allUsers = await prisma.user.findFirst()
      expect(allUsers).toEqual(new User(userExpected))
    })
  })

  describe('delete', () => {
    it('[正常系]特定のidのuserを削除できる', async () => {
      await seedAllUserStatus()
      const data = [
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
      await prisma.user.createMany({ data })
      await userRepo.delete('1')
      const allUsers = await prisma.user.findMany()
      expect(allUsers).toHaveLength(1)
      expect(allUsers[0]).toEqual(data[1])
    })
  })
})
