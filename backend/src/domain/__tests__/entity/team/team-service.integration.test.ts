import { prisma } from '@testUtil/prisma'
import { resetDatabase } from '@testUtil/resetDB'
import { seedTeamAndUsers } from '@testUtil/team/seed-team'
import { seedAllUserStatus } from '@testUtil/user-status-factory'
import { createUser } from '@testUtil/user/user-factory'
import { TeamService } from 'src/domain/entity/team/team-service'
import { TeamRepository } from 'src/infra/db/repository/team-repository'
import { UserRepository } from 'src/infra/db/repository/user-repository'
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing'
import { mocked } from 'ts-jest/utils'

// TODO: 遅い。このファイルだけで9sかかる。（他にも遅いファイルあり）
describe('team-service.integration.ts', () => {
  describe('deleteTeamUser', () => {
    let mockTeamRepo: MockedObjectDeep<TeamRepository>
    let mockUserRepo: MockedObjectDeep<UserRepository>
    beforeAll(async () => {
      mockTeamRepo = mocked(new TeamRepository(prisma), true)
      mockUserRepo = mocked(new UserRepository(prisma), true)
    })
    beforeEach(async () => {
      await resetDatabase()
    })
    afterAll(async () => {
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
      await teamService.deleteTeamUserAndSave(team, '1')
      expect(team.getAllProperties().teamUsers).toHaveLength(3)
    })

    it('[正常系]削除の結果チームの参加者が2名以下の場合、最も参加人数が少ないチームと合併される', async () => {
      await seedAllUserStatus()
      // マージ対象のチーム
      await seedTeamAndUsers({
        users: [
          createUser({ id: '6' }),
          createUser({ id: '7' }),
          createUser({ id: '8' }),
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
      const resultTeam = await teamService.deleteTeamUserAndSave(team, '1')
      expect(resultTeam.getAllProperties().teamUsers).toHaveLength(5)
    })
  })
})
