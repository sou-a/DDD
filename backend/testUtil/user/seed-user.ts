import * as faker from 'faker'
import { prisma } from '@testUtil/prisma'
import { User } from 'src/domain/entity/user/user'
import { UserStatus } from 'src/domain/valueOblect/user-status'

export const seedUser = async (params: {
  id?: string
  name?: string
  mailAddress?: string
  userStatusId?: string
}) => {
  let { id, name, mailAddress, userStatusId } = params
  id = id ?? faker.random.uuid()
  name = name ?? faker.name.findName()
  mailAddress = mailAddress ?? 'B'
  userStatusId = userStatusId ?? '1'

  await prisma.user.create({
    data: {
      id,
      name,
      mailAddress,
      userStatusId,
    },
  })
  const userStatus = await prisma.userStatus.findFirst({
    where: {
      id: userStatusId,
    },
  })
  if (!userStatus) {
    throw new Error('想定外のエラー')
  }
  return new User({
    id,
    name,
    mailAddress,
    status: new UserStatus(userStatus.name),
  })
}
