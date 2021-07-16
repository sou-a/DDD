import { createUser } from 'src/__tests__/testUtil/user/user-factory'
import * as faker from 'faker'
import { Team } from 'src/domain/team/team'
import { User } from 'src/domain/user/user'
import { UserStatus } from 'src/domain/user/user-status'

export const createTeam = (params: {
  id?: string
  name?: string
  users?: User[]
}) => {
  let { id, name, users } = params
  id = id ?? faker.random.uuid()
  name = name ?? `${faker.random.number()}`
  users = users ?? [createUser({}), createUser({}), createUser({})]
  return new Team({ id, name, users })
}
