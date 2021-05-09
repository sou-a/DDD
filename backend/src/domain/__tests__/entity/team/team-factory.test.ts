import { PrismaClient } from '@prisma/client'
import { seedTeam } from '@testUtil/team-factory'
import { createUser } from '@testUtil/user-factory'
import { TeamFactory } from 'src/domain/entity/team/team-factory'
import { TeamRepository } from 'src/infra/db/repository/team-repository'
import { createRandomIdString } from 'src/util/random'
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing'
import { mocked } from 'ts-jest/utils'

describe('team-factory.ts', () => {
  describe('createTeam', () => {
    let mockTeamRepo: MockedObjectDeep<TeamRepository>
    beforeAll(() => {
      const prisma = new PrismaClient()
      mockTeamRepo = mocked(new TeamRepository(prisma), true)
    })
    it('[正常系]チームを生成できる', async () => {
      const teamFactory = new TeamFactory({
        teamRepository: mockTeamRepo,
      })
      const users = [createUser({}), createUser({}), createUser({})]
      const team = await teamFactory.createTeam({ name: '1', users })
      expect(team).toHaveLength(1)
    })

    it('[準正常系]チーム名が重複している場合エラー', async () => {
      await seedTeam({
        id: createRandomIdString(),
        name: '1',
        users: [createUser({}), createUser({}), createUser({})],
      })
      const teamFactory = new TeamFactory({
        teamRepository: mockTeamRepo,
      })
      const users = [createUser({}), createUser({}), createUser({})]
      expect(
        await teamFactory.createTeam({ name: '1', users }),
      ).rejects.toThrow()
    })
  })
})
