import { createTeamUser, seedTeam } from '@testUtil/team-factory'
import { createUser } from '@testUtil/user-factory'
import { UserStatus } from 'src/domain/valueOblect/user-status'
import { createRandomIdString } from 'src/util/random'

describe('team.ts', () => {
  describe('constructor', () => {
    it('[正常系]生成できる', () => {
      seedTeam({
        id: createRandomIdString(),
        name: '1',
        users: [createUser({}), createUser({}), createUser({})],
      })
    })

    it('[準正常系]チーム名は数字のみ', () => {
      expect(
        seedTeam({
          id: createRandomIdString(),
          name: 'a',
          users: [createUser({}), createUser({})],
        }),
      ).toThrow()
    })

    it('[準正常系]参加者2名以下の場合エラー', () => {
      expect(
        seedTeam({
          id: createRandomIdString(),
          name: '1',
          users: [createUser({}), createUser({})],
        }),
      ).toThrow()
    })

    it('[準正常系]activeの参加者のみチームに入れる', () => {
      expect(
        createTeamUser({
          status: new UserStatus('休会中'),
        }),
      ).toThrow()
      expect(
        createTeamUser({
          status: new UserStatus('退会済'),
        }),
      ).toThrow()
    })
  })

  describe('addTeamUser', () => {
    it('[正常系]チームユーザーを追加できる', () => {
      seedTeam({
        id: createRandomIdString(),
        name: '1',
        users: [createUser({}), createUser({}), createUser({})],
      })
    })
  })
})
