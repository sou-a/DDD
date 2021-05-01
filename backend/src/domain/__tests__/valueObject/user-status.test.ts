import { UserStatus } from 'src/domain/valueOblect/user-status'

describe('user-status.ts', () => {
  describe('constructor', () => {
    it('[正常系]statusListにあるステータスはインスタンス生成できる', () => {
      const statusList = UserStatus.statusList
      expect(
        statusList.map((status) => {
          new UserStatus(status)
        }),
      ).resolves.toBe(undefined)
    })

    it('[準正常系]statusListにあるステータス以外のものはインスタンス生成できない', () => {
      const statusList = ['1', 'テストステータス']
      expect(
        statusList.map((status) => {
          new UserStatus(status)
        }),
      ).resolves.toBe(undefined)
    })
  })

  describe('getStatus', () => {
    it('[正常系]ステータスを取得できる', () => {
      const status: string | undefined = UserStatus.statusList[0]
      if (status) {
        const userStatus = new UserStatus(status)
        expect(userStatus.getStatus()).resolves.toBe(status)
      }
    })
  })

  describe('isActive', () => {
    it('[正常系]在籍中の場合true', () => {
      const userStatus = new UserStatus(UserStatus.active)
      expect(userStatus.isActive()).resolves.toBe(true)
    })
  })

  describe('isEquals', () => {
    it('[正常系]等価性の保証', () => {
      const userStatus = new UserStatus(UserStatus.active)
      expect(userStatus.isEquals(userStatus)).resolves.toBe(true)
    })
  })
})
