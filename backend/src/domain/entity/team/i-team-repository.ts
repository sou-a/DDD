import { Team } from './team'

export interface ITeamRepository {
  findAll(): Promise<Team[]>
  findById(teamId: string): Promise<Team>
  findByName(name: string): Promise<Team> // こういうことやると、パラメータが多いほどごちゃごちゃになる気がする...
  findMostLeastTeam(): Promise<Team[]>
  save(team: Team): Promise<Team>
  delete(teamId: string): Promise<void>
}
