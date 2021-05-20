import { createUser } from '@testUtil/user/user-factory'
import { Team } from 'src/domain/entity/team/team'
import { UserStatus } from 'src/domain/valueOblect/user-status'
import { createRandomIdString } from 'src/util/random'

describe('team.ts', () => {
  describe('constructor', () => {
    it('[正常系]生成できる', () => {
      expect(
        new Team({
          id: createRandomIdString(),
          name: '1',
          users: [createUser({}), createUser({}), createUser({})],
        }),
      ).toEqual(expect.any(Team))
    })

    it('[準正常系]チーム名は数字のみ', () => {
      expect(
        () =>
          new Team({
            id: createRandomIdString(),
            name: 'a',
            users: [createUser({}), createUser({}), createUser({})],
          }),
      ).toThrow(Error)
    })

    it('[準正常系]参加者2名以下の場合エラー', () => {
      expect(
        () =>
          new Team({
            id: createRandomIdString(),
            name: '1',
            users: [createUser({}), createUser({})],
          }),
      ).toThrow(Error)
    })

    it('[準正常系]activeの参加者のみチームに入れる', () => {
      expect(
        () =>
          new Team({
            id: createRandomIdString(),
            name: '1',
            users: [
              createUser({ status: new UserStatus(UserStatus.recess) }),
              createUser({ status: new UserStatus(UserStatus.recess) }),
              createUser({ status: new UserStatus(UserStatus.recess) }),
            ],
          }),
      ).toThrow(Error)
      expect(
        () =>
          new Team({
            id: createRandomIdString(),
            name: '1',
            users: [
              createUser({ status: new UserStatus(UserStatus.leave) }),
              createUser({ status: new UserStatus(UserStatus.leave) }),
              createUser({ status: new UserStatus(UserStatus.leave) }),
            ],
          }),
      ).toThrow(Error)
    })
  })

  describe('addTeamUser', () => {
    it('[正常系]チームユーザーを追加できる', () => {
      const team = new Team({
        id: createRandomIdString(),
        name: '1',
        users: [createUser({}), createUser({}), createUser({})],
      })
      expect(team.getAllProperties().teamUsers).toHaveLength(3)
      team.addTeamUser(createUser({}))
      expect(team.getAllProperties().teamUsers).toHaveLength(4)
    })
  })

  describe('removeTeamUserFromTeamService', () => {
    it('[正常系]チームユーザーを削除できる', () => {
      const team = new Team({
        id: createRandomIdString(),
        name: '1',
        users: [
          createUser({ id: '1' }),
          createUser({ id: '2' }),
          createUser({ id: '3' }),
          createUser({ id: '4' }),
        ],
      })
      expect(team.getAllProperties().teamUsers).toHaveLength(4)
      team.removeTeamUserFromTeamService('1')
      expect(team.getAllProperties().teamUsers).toHaveLength(3)
    })
  })
})
