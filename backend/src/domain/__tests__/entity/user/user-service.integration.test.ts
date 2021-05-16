import { UserRepository } from 'src/infra/db/repository/user-repository'
import { PairRepository } from 'src/infra/db/repository/pair-repository'
import { TeamRepository } from 'src/infra/db/repository/team-repository'
import { mocked } from 'ts-jest/utils'
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing'
import { TeamService } from 'src/domain/entity/team/team-service'
import { UserService } from 'src/domain/entity/user/user-service'
import { prisma } from '@testUtil/prisma'
import { seedAllUserStatus } from '@testUtil/user-status-factory'
import { seedTeamAndUsers } from '@testUtil/team/seed-team'
import { createUser } from '@testUtil/user/user-factory'
import { seedPair, seedPairUser } from '@testUtil/pair/seed-pair'

describe('user-service.integration.ts', () => {
  describe('delete', () => {
    let mockUserRepo: MockedObjectDeep<UserRepository>
    let mockPairRepo: MockedObjectDeep<PairRepository>
    let mockTeamRepo: MockedObjectDeep<TeamRepository>
    let mockTeamService: MockedObjectDeep<TeamService>
    beforeAll(() => {
      mockUserRepo = mocked(new UserRepository(prisma), true)
      mockPairRepo = mocked(new PairRepository(prisma), true)
      mockTeamRepo = mocked(new TeamRepository(prisma), true)
      mockTeamService = mocked(
        new TeamService({
          teamRepository: mockTeamRepo,
          userRepository: mockUserRepo,
        }),
        true,
      )
    })
    beforeEach(async () => {
      await prisma.teamUser.deleteMany()
      await prisma.pairUser.deleteMany()
      await prisma.pair.deleteMany()
      await prisma.team.deleteMany()
      await prisma.user.deleteMany()
      await prisma.userStatus.deleteMany()
    })
    it('[正常系]ユーザーを削除したとき関連する中間テーブルからも削除する', async () => {
      const userService = new UserService({
        userRepository: mockUserRepo,
        pairRepository: mockPairRepo,
        teamRepository: mockTeamRepo,
        teamService: mockTeamService,
      })

      // TODO: テストデータを作るのが面倒
      await seedAllUserStatus()
      await seedTeamAndUsers({
        users: [
          createUser({ id: '1' }),
          createUser({ id: '2' }),
          createUser({ id: '3' }),
          createUser({ id: '4' }),
        ],
      })

      await seedPair({ id: '1' })
      await seedPairUser({ pairId: '1', userId: '1' })
      await seedPairUser({ pairId: '1', userId: '2' })
      await seedPairUser({ pairId: '1', userId: '3' })

      let user = await prisma.user.findMany()
      let pairUser = await prisma.pairUser.findMany()
      let teamUser = await prisma.teamUser.findMany()
      expect(user).toHaveLength(4)
      expect(pairUser).toHaveLength(3)
      expect(teamUser).toHaveLength(4)

      await userService.deleteUser('1')

      user = await prisma.user.findMany()
      pairUser = await prisma.pairUser.findMany()
      teamUser = await prisma.teamUser.findMany()
      expect(user).toHaveLength(3)
      expect(pairUser).toHaveLength(2)
      expect(teamUser).toHaveLength(3)
    })
  })
})