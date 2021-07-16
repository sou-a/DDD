import { prisma } from 'src/__tests__/testUtil/prisma'
import { seedTeamAndUsers } from 'src/__tests__/testUtil/team/seed-team'
import { seedAllUserStatus } from 'src/__tests__/testUtil/user-status-factory'
import { createUser } from 'src/__tests__/testUtil/user/user-factory'
import { Team } from 'src/domain/team/team'
import { TeamFactory } from 'src/domain/team/team-factory'
import { TeamRepository } from 'src/infra/db/repository/team-repository'
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing'
import { mocked } from 'ts-jest/utils'

describe('team-factory.integration.ts', () => {
  describe('createTeam', () => {
    let mockTeamRepo: MockedObjectDeep<TeamRepository>
    afterAll(async () => {
      await prisma.$disconnect()
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
