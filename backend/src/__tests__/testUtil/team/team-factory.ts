import { createUser } from 'src/__tests__/testUtil/user/user-factory'
import * as faker from 'faker'
import { Team } from 'src/domain/team/team'
import { User } from 'src/domain/user/user'
import { TeamId } from 'src/domain/team/team-id'

export const createTeam = (params: {
  id?: string
  name?: string
  users?: User[]
}) => {
  let { name, users } = params
  const id = params.id ?? faker.random.uuid()
  name = name ?? `${faker.random.number()}`
  users = users ?? [createUser({}), createUser({}), createUser({})]
  return new Team({ id: new TeamId(id), name, users })
}
