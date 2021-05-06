import { TeamUser } from 'src/domain/entity/team/team'

export class TeamDTO {
  public readonly id: string
  public readonly name: string
  public readonly teamUsers: TeamUser[]
  public constructor(props: {
    id: string
    name: string
    teamUsers: TeamUser[]
  }) {
    const { id, name, teamUsers } = props
    this.id = id
    this.name = name
    this.teamUsers = teamUsers
  }
}
