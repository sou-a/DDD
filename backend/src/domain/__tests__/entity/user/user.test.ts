import { User } from 'src/domain/entity/user/user'
import { UserStatus } from 'src/domain/valueOblect/user-status'

describe('user.ts', () => {
  describe('changeStatus', () => {
    it('[正常系]userStatusを変更できる', async () => {
      const user = new User({
        id: '1',
        name: 'user1',
        mailAddress: 'sample@example.com',
        status: new UserStatus(UserStatus.active),
      })
      user.changeStatus(new UserStatus('休会中'))
      return expect(user.getAllProperties().status).toBe(
        new UserStatus('休会中'),
      )
    })
  })
})
