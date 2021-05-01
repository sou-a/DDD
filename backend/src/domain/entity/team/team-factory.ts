import { createRandomIdString } from 'src/util/random'
import { User } from '../user/user'
import { Team } from './team'
import { ITeamRepository } from './i-team-repository'

export class TeamFactory {
  private teamRepository: ITeamRepository
  public constructor(props: { teamRepository: ITeamRepository }) {
    const { teamRepository } = props

    this.teamRepository = teamRepository
  }

  public async createTeam(name: string, users: Array<User>): Promise<Team> {
    const team = await this.teamRepository.findByName(name)
    if (!team) {
      throw new Error('チーム名が重複しています')
    }
    return new Team({
      id: createRandomIdString(),
      name: name,
      users: users,
    })
  }
}
