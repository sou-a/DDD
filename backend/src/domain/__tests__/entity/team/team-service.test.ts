import { PrismaClient } from '@prisma/client'
import { seedTeam } from '@testUtil/team-factory'
import { createUser } from '@testUtil/user-factory'
import { TeamService } from 'src/domain/entity/team/team-service'
import { TeamRepository } from 'src/infra/db/repository/team-repository'
import { createRandomIdString } from 'src/util/random'
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing'
import { mocked } from 'ts-jest/utils'

describe('team-service.ts', () => {
  describe('deleteTeamUser', () => {
    let mockTeamRepo: MockedObjectDeep<TeamRepository>
    beforeAll(() => {
      const prisma = new PrismaClient()
      mockTeamRepo = mocked(new TeamRepository(prisma), true)
    })
    it('[正常系]チームユーザーを削除できる', async () => {
      const team = await seedTeam({
        id: createRandomIdString(),
        name: '1',
        users: [
          createUser({ id: '1' }),
          createUser({ id: '2' }),
          createUser({ id: '3' }),
        ],
      })
      const teamService = new TeamService({
        teamRepository: mockTeamRepo,
      })
      teamService.deleteTeamUser(team, '1')
      expect(team.getAllProperties().teamUsers).toHaveLength(2)
    })

    it('[正常系]削除の結果チームの参加者が2名以下の場合、最も参加人数が少ないチームと合併される', async () => {
      const team = await seedTeam({
        id: createRandomIdString(),
        name: '1',
        users: [
          createUser({ id: '1' }),
          createUser({ id: '2' }),
          createUser({ id: '3' }),
        ],
      })
      const mergedTeam = await seedTeam({
        id: createRandomIdString(),
        name: '1',
        users: [
          createUser({ id: '4' }),
          createUser({ id: '5' }),
          createUser({ id: '6' }),
        ],
      })
      const teamService = new TeamService({
        teamRepository: mockTeamRepo,
      })
      teamService.deleteTeamUser(team, '1')
      expect(team.getAllProperties().teamUsers).toHaveLength(5)
    })
  })
})
