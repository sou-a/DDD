import { createUser } from '@testUtil/user/user-factory'
import * as faker from 'faker'
import { Team, TeamUser } from 'src/domain/entity/team/team'
import { User } from 'src/domain/entity/user/user'
import { UserStatus } from 'src/domain/valueOblect/user-status'

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

export const createTeamUser = (params: {
  teamId?: string
  userId?: string
  status?: UserStatus
}) => {
  const { teamId, userId, status } = params
  return new TeamUser({
    teamId: teamId ?? faker.random.uuid(),
    userId: userId ?? faker.random.uuid(),
    status: status ?? new UserStatus(UserStatus.active),
  })
}
