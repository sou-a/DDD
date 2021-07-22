import { TeamService } from 'src/domain/team/team-service'
import { TeamRepository } from 'src/infra/db/repository/team-repository'
import { UserRepository } from 'src/infra/db/repository/user-repository'
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing'
import { mocked } from 'ts-jest/utils'
import { UserId } from 'src/domain/user/user-id'
import { prisma } from '@testUtil/prisma'
import { seedTeamAndUsers } from '@testUtil/team/seed-team'
import { seedAllUserStatus } from '@testUtil/user-status-factory'
import { createUser } from '@testUtil/user/user-factory'

describe('team-service.integration.ts', () => {
  describe('deleteTeamUser', () => {
    let mockTeamRepo: MockedObjectDeep<TeamRepository>
    let mockUserRepo: MockedObjectDeep<UserRepository>
    beforeAll(async () => {
      mockTeamRepo = mocked(new TeamRepository(prisma), true)
      mockUserRepo = mocked(new UserRepository(prisma), true)
    })
    beforeEach(async () => {
      await prisma.teamUser.deleteMany()
      await prisma.user.deleteMany()
      await prisma.team.deleteMany()
      await prisma.userStatus.deleteMany()
    })
    afterAll(async () => {
      await prisma.teamUser.deleteMany()
      await prisma.user.deleteMany()
      await prisma.team.deleteMany()
      await prisma.userStatus.deleteMany()

      await prisma.$disconnect()
    })
    it('[正常系]チームユーザーを削除できる', async () => {
      await seedAllUserStatus()
      const team = await seedTeamAndUsers({
        users: [
          createUser({ id: '1' }),
          createUser({ id: '2' }),
          createUser({ id: '3' }),
          createUser({ id: '4' }),
        ],
      })
      const teamService = new TeamService({
        teamRepository: mockTeamRepo,
        userRepository: mockUserRepo,
      })
      await teamService.deleteTeamUserAndSave(team, new UserId('1'))
      expect(team.getAllProperties().teamUsers).toHaveLength(3)
    })

    it('[正常系]削除の結果チームの参加者が2名以下の場合、最も参加人数が少ないチームと合併される', async () => {
      await seedAllUserStatus()
      // マージ対象のチーム
      await seedTeamAndUsers({
        users: [
          createUser({ id: '4' }),
          createUser({ id: '5' }),
          createUser({ id: '6' }),
        ],
      })
      const team = await seedTeamAndUsers({
        users: [
          createUser({ id: '1' }),
          createUser({ id: '2' }),
          createUser({ id: '3' }),
        ],
      })
      const teamService = new TeamService({
        teamRepository: mockTeamRepo,
        userRepository: mockUserRepo,
      })
      const resultTeam = await teamService.deleteTeamUserAndSave(
        team,
        new UserId('1'),
      )
      expect(resultTeam.getAllProperties().teamUsers).toHaveLength(5)
    })
  })
})
