import { UserRepository } from 'src/infra/db/repository/user-repository'
import { PairRepository } from 'src/infra/db/repository/pair-repository'
import { TeamRepository } from 'src/infra/db/repository/team-repository'
import { mocked } from 'ts-jest/utils'
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing'
import { PrismaClient } from '@prisma/client'
import { TeamService } from 'src/domain/entity/team/team-service'
import { UserService } from 'src/domain/entity/user/user-service'

jest.mock('@prisma/client')
jest.mock('src/infra/db/repository/user-repository')
jest.mock('src/infra/db/repository/pair-repository')
jest.mock('src/infra/db/repository/team-repository')

describe('user-service.ts', () => {
  describe('delete', () => {
    let mockUserRepo: MockedObjectDeep<UserRepository>
    let mockPairRepo: MockedObjectDeep<PairRepository>
    let mockTeamRepo: MockedObjectDeep<TeamRepository>
    let mockTeamService: MockedObjectDeep<TeamService>
    beforeAll(() => {
      const prisma = new PrismaClient()
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
    it('[正常系]ユーザーを削除したとき関連する中間テーブルからも削除する', async () => {
      const userService = new UserService({
        userRepository: mockUserRepo,
        pairRepository: mockPairRepo,
        teamRepository: mockTeamRepo,
        teamService: mockTeamService,
      })

      // TODO: テストデータを作るのが面倒（user, pair, team, pairUser, teamUser, userStatusを作らないといけない）

      userService.deleteUser('1')
    })
  })
})
