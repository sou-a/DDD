import * as faker from 'faker'
import { prisma } from '@testUtil/prisma'
import { User } from 'src/domain/entity/user/user'
import { UserStatus } from 'src/domain/valueOblect/user-status'

export const createUser = (params: {
  id?: string
  name?: string
  mailAddress?: string
  status?: UserStatus
}) => {
  const { id, name, mailAddress, status } = params
  return new User({
    id: id ?? faker.random.uuid(),
    name: name ?? 'A',
    mailAddress: mailAddress ?? 'B',
    status: status ?? new UserStatus(UserStatus.active),
  })
}

export const seedUser = async (params: {
  id?: string
  name?: string
  mailAddress?: string
  userStatusId?: string
}) => {
  let { id, name, mailAddress, userStatusId } = params
  id = id ?? faker.random.uuid()
  name = name ?? 'A'
  mailAddress = mailAddress ?? 'B'
  userStatusId = userStatusId ?? faker.random.uuid()
  await prisma.user.create({
    data: {
      id,
      name,
      mailAddress,
      userStatusId,
    },
  })
}
