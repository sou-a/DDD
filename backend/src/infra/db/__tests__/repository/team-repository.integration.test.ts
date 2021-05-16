import { createRandomIdString } from 'src/util/random'
import { prisma } from '@testUtil/prisma'
import { createUser } from '@testUtil/user/user-factory'
import { TeamRepository } from '../../repository/team-repository'
import { Team } from 'src/domain/entity/team/team'

describe('team-repository.ts', () => {
  const teamRepo = new TeamRepository(prisma)
  beforeAll(async () => {
    await prisma.team.deleteMany({})
  })
  afterAll(async () => {
    await prisma.$disconnect()
  })

  describe('findAll', () => {
    afterEach(async () => {
      await prisma.team.deleteMany({})
    })
    it('[正常系]teamを全て取得できる', async () => {
      const teamsExpected = [
        {
          id: createRandomIdString(),
          name: '1',
        },
        {
          id: createRandomIdString(),
          name: '2',
        },
      ]
      await prisma.team.createMany({ data: teamsExpected })
      expect(await teamRepo.findAll()).toHaveLength(2)
    })
  })

  describe('findById', () => {
    afterEach(async () => {
      await prisma.team.deleteMany({})
    })
    it('[正常系]特定のidのteamを取得できる', async () => {
      const teamsExpected = [
        {
          id: '1',
          name: '1',
        },
        {
          id: '2',
          name: '2',
        },
      ]
      await prisma.team.createMany({ data: teamsExpected })
      expect(await teamRepo.findById('1')).toHaveLength(1)
    })
  })

  describe('findByUserId', () => {
    afterEach(async () => {
      await prisma.team.deleteMany({})
    })
    it('[正常系]特定のuserIdのteamを取得できる', async () => {
      const teamExpected = [
        {
          id: '1',
          name: '1',
        },
      ]
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
          mailAddress: '2sample@example.com',
        },
      ]
      const teamUsersExpected = [
        {
          teamId: '1',
          userId: '1',
        },
        {
          teamId: '1',
          userId: '2',
        },
      ]
      await prisma.team.createMany({ data: teamExpected })
      await prisma.user.createMany({ data: usersExpected })
      await prisma.teamUser.createMany({ data: teamUsersExpected })
      expect(await teamRepo.findByUserId('1')).toHaveLength(1)
    })
  })

  describe('findByName', async () => {
    const teamExpected = [
      {
        id: '1',
        name: '1',
      },
    ]
    await prisma.team.createMany({ data: teamExpected })
    it('[正常系]特定のnameのteamを取得できる', async () => {
      expect(await teamRepo.findByName('1')).toHaveLength(1)
    })

    it('[準正常系]nameが見つからない場合エラー', async () => {
      expect(await teamRepo.findByName('2')).rejects.toThrow()
    })
  })

  describe('findMostLeastTeams', async () => {
    const teamExpected = [
      {
        id: '1',
        name: '1',
      },
      {
        id: '2',
        name: '2',
      },
    ]
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
        mailAddress: '2sample@example.com',
      },
    ]
    const teamUsersExpected = [
      {
        teamId: '1',
        userId: '1',
      },
      {
        teamId: '1',
        userId: '2',
      },
    ]
    await prisma.team.createMany({ data: teamExpected })
    await prisma.user.createMany({ data: usersExpected })
    await prisma.teamUser.createMany({ data: teamUsersExpected })
    it('[正常系]チーム参加者が最小のteamを取得できる', async () => {
      expect(await teamRepo.findMostLeastTeams()).toHaveLength(1)
    })
  })

  describe('save', () => {
    afterEach(async () => {
      await prisma.team.deleteMany({})
    })
    it('[正常系]teamを保存できる', async () => {
      const teamExpected = {
        id: createRandomIdString(),
        name: 'user1',
        users: [createUser({}), createUser({})],
      }
      await teamRepo.save(new Team(teamExpected))

      const allTeams = await prisma.team.findMany({})
      expect(allTeams).toHaveLength(1)
      expect(allTeams[0]).toEqual(teamExpected)
    })
  })

  describe('delete', () => {
    afterEach(async () => {
      await prisma.team.deleteMany({})
    })
    it('[正常系]特定のidのteamを削除できる', async () => {
      const teamsExpected = [
        {
          id: '1',
          name: 'user1',
        },
        {
          id: '2',
          name: 'user2',
        },
      ]
      await prisma.team.createMany({ data: teamsExpected })
      await teamRepo.delete('1')
      const allTeams = await prisma.team.findMany({})
      expect(allTeams).toHaveLength(1)
    })
  })

  describe('deleteTeamUser', () => {
    afterEach(async () => {
      await prisma.team.deleteMany({})
    })
    it('[正常系]特定のidのtaemUserを削除できる', async () => {
      const teamExpected = [
        {
          id: '1',
          name: '1',
        },
      ]
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
          mailAddress: '2sample@example.com',
        },
      ]
      const teamUsersExpected = [
        {
          teamId: '1',
          userId: '1',
        },
        {
          teamId: '1',
          userId: '2',
        },
      ]
      await prisma.team.createMany({ data: teamExpected })
      await prisma.user.createMany({ data: usersExpected })
      await prisma.teamUser.createMany({ data: teamUsersExpected })
      await teamRepo.deleteTeamUser('1')
      const allTeams = await prisma.teamUser.findMany({})
      expect(allTeams).toHaveLength(1)
    })
  })
})
