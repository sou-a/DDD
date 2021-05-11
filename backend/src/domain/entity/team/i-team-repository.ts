import { Team } from './team'

export interface ITeamRepository {
  findAll(): Promise<Team[]>
  findById(teamId: string): Promise<Team>
  findByUserId(userId: string): Promise<Team | null>
  findByName(name: string): Promise<Team | null>
  findMostLeastTeams(): Promise<Team[]>
  save(team: Team): Promise<Team>
  delete(teamId: string): Promise<void>
  deleteTeamUser(userId: string): Promise<void>
}
