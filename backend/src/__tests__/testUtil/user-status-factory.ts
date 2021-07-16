import { prisma } from 'src/__tests__/testUtil/prisma'
import { UserStatus } from 'src/domain/user/user-status'

export const seedAllUserStatus = async () => {
  const data = [
    {
      id: '1',
      name: UserStatus.active,
    },
    {
      id: '2',
      name: UserStatus.recess,
    },
    {
      id: '3',
      name: UserStatus.leave,
    },
  ]

  await prisma.userStatus.createMany({
    data,
  })
}
