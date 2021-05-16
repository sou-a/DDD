import * as faker from 'faker'
import { Team, TeamUser } from 'src/domain/entity/team/team'
import { UserStatus } from 'src/domain/valueOblect/user-status'

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
