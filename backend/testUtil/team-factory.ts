import * as faker from 'faker'
import { prisma } from '@testUtil/prisma'
import { Team, TeamUser } from 'src/domain/entity/team/team'
import { UserStatus } from 'src/domain/valueOblect/user-status'
import { User } from 'src/domain/entity/user/user'
import { createUser } from './user-factory'

export const seedTeam = async (params: {
  id?: string
  name?: string
  users?: User[]
}) => {
  const { id, name, users } = params
  const teamEntity = new Team({
    id: id ?? faker.random.uuid(),
    name: name ?? '1',
    users: users ?? [createUser({}), createUser({})],
  })
  await prisma.team.create({
    data: {
      ...teamEntity.getAllProperties(),
    },
  })
  return teamEntity
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
