import { Pair } from 'src/domain/entity/pair/pair'
import { User } from 'src/domain/entity/user/user'
import { UserStatus } from 'src/domain/valueOblect/user-status'
import { createRandomIdString } from 'src/util/random'

describe('pair.ts', () => {
  describe('constructor', () => {
    const users: User[] = [
      new User({
        id: createRandomIdString(),
        name: 'user1',
        mailAddress: 'sample@example.com',
        status: new UserStatus(UserStatus.active),
      }),
      new User({
        id: createRandomIdString(),
        name: 'user2',
        mailAddress: 'sample2@example.com',
        status: new UserStatus(UserStatus.active),
      }),
    ]
    it('[正常系]生成できる', () => {
      const pair = new Pair({
        id: createRandomIdString(),
        name: 'a',
        users,
      })
      expect(pair).resolves.toBe(undefined)
    })
    it('[準正常系]名前は英文字のみ', () => {
      const pair = new Pair({
        id: createRandomIdString(),
        name: '1',
        users,
      })
      expect(pair).toThrow()
    })
    it('[準正常系]参加者が1名の場合はエラー', () => {
      const user: User[] = [
        new User({
          id: createRandomIdString(),
          name: 'user1',
          mailAddress: 'sample@example.com',
          status: new UserStatus(UserStatus.active),
        }),
      ]
      const pair = new Pair({
        id: createRandomIdString(),
        name: '1',
        users: user,
      })
      expect(pair).toThrow()
    })
    it('[準正常系]参加者が4名の場合はエラー', () => {
      const tooManyUsers: User[] = [
        new User({
          id: createRandomIdString(),
          name: 'user1',
          mailAddress: 'sample1@example.com',
          status: new UserStatus(UserStatus.active),
        }),
        new User({
          id: createRandomIdString(),
          name: 'user2',
          mailAddress: 'sample2@example.com',
          status: new UserStatus(UserStatus.active),
        }),
        new User({
          id: createRandomIdString(),
          name: 'user3',
          mailAddress: 'sample3@example.com',
          status: new UserStatus(UserStatus.active),
        }),
        new User({
          id: createRandomIdString(),
          name: 'user4',
          mailAddress: 'sample4@example.com',
          status: new UserStatus(UserStatus.active),
        }),
      ]
      const pair = new Pair({
        id: createRandomIdString(),
        name: '1',
        users: tooManyUsers,
      })
      expect(pair).toThrow()
    })
    it('[準正常系]active以外のユーザーはペアに参加できない', () => {
      const recessUsers: User[] = [
        new User({
          id: createRandomIdString(),
          name: 'user1',
          mailAddress: 'sample1@example.com',
          status: new UserStatus(UserStatus.active),
        }),
        new User({
          id: createRandomIdString(),
          name: 'user2',
          mailAddress: 'sample2@example.com',
          status: new UserStatus('休会中'),
        }),
      ]
      const recessPair = new Pair({
        id: createRandomIdString(),
        name: 'a',
        users: recessUsers,
      })
      const leaveUsers: User[] = [
        new User({
          id: createRandomIdString(),
          name: 'user1',
          mailAddress: 'sample1@example.com',
          status: new UserStatus(UserStatus.active),
        }),
        new User({
          id: createRandomIdString(),
          name: 'user2',
          mailAddress: 'sample2@example.com',
          status: new UserStatus('退会済'),
        }),
      ]
      const leavePair = new Pair({
        id: createRandomIdString(),
        name: 'a',
        users: leaveUsers,
      })
      expect(recessPair).toThrow()
      expect(leavePair).toThrow()
    })
    describe('addPairUser', () => {
      it('ペアユーザーを追加できる', () => {
        const pair = new Pair({
          id: createRandomIdString(),
          name: 'a',
          users,
        })
        const addUser: User = new User({
          id: createRandomIdString(),
          name: 'user1',
          mailAddress: 'sample1@example.com',
          status: new UserStatus(UserStatus.active),
        })
        pair.addPairUser(addUser)
        expect(pair).toHaveLength(3)
      })
    })
    describe('removePairUser', () => {
      it('ペアユーザーを削除できる', () => {
        const manyUsers: User[] = [
          new User({
            id: '1',
            name: 'user1',
            mailAddress: 'sample1@example.com',
            status: new UserStatus(UserStatus.active),
          }),
          new User({
            id: '2',
            name: 'user2',
            mailAddress: 'sample2@example.com',
            status: new UserStatus(UserStatus.active),
          }),
          new User({
            id: '3',
            name: 'user3',
            mailAddress: 'sample3@example.com',
            status: new UserStatus(UserStatus.active),
          }),
        ]
        const pair = new Pair({
          id: createRandomIdString(),
          name: 'a',
          users: manyUsers,
        })
        pair.removePairUser('1')
        expect(pair).toHaveLength(2)
      })
    })
  })
})
