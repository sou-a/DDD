import { Team } from './team'

export interface ITeamRepository {
  findAll(): Array<Team>
  findByName(name: string): Array<Team> // こういうことやると、パラメータが多いほどごちゃごちゃになる気がする...
  findMostLeastTeam(): Team
  save(team: Team): void
  delete(teamId: string): void
}
