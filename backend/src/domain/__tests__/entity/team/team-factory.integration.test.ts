import { prisma } from '@testUtil/prisma'
import { seedTeamAndUsers } from '@testUtil/team/seed-team'
import { seedAllUserStatus } from '@testUtil/user-status-factory'
import { createUser } from '@testUtil/user/user-factory'
import { Team } from 'src/domain/entity/team/team'
import { TeamFactory } from 'src/domain/entity/team/team-factory'
import { TeamRepository } from 'src/infra/db/repository/team-repository'
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing'
import { mocked } from 'ts-jest/utils'

describe('team-factory.integration.ts', () => {
  describe('createTeam', () => {
    let mockTeamRepo: MockedObjectDeep<TeamRepository>
    beforeEach(async () => {
      // TODO: 関係ありそうなテーブルを削除し無いといけないのは面倒
      await prisma.teamUser.deleteMany()
      await prisma.pairUser.deleteMany()
      await prisma.team.deleteMany()
      await prisma.user.deleteMany()
      await prisma.userStatus.deleteMany()
    })
    afterAll(async () => {
      await prisma.$disconnect()
    })
    it('[正常系]チームを生成できる', async () => {
      mockTeamRepo = mocked(new TeamRepository(prisma), true)

      const teamFactory = new TeamFactory({
        teamRepository: mockTeamRepo,
      })
      const users = [createUser({}), createUser({}), createUser({})]
      expect(teamFactory.createTeam({ name: '1', users })).resolves.toEqual(
        expect.any(Team),
      )
    })

    it('[準正常系]チーム名が重複している場合エラー', async () => {
      mockTeamRepo = mocked(new TeamRepository(prisma), true)

      await seedAllUserStatus()
      await seedTeamAndUsers({
        name: '1',
      })
      const teamFactory = new TeamFactory({
        teamRepository: mockTeamRepo,
      })
      const users = [createUser({}), createUser({}), createUser({})]
      expect(() =>
        teamFactory.createTeam({ name: '1', users }),
      ).rejects.toThrow(Error)
    })
  })
})
