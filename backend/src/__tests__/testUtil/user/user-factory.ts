import * as faker from 'faker'
import { User } from 'src/domain/user/user'
import { UserStatus } from 'src/domain/user/user-status'

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
