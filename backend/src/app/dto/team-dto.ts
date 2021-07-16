export class TeamDTO {
  public readonly id: string
  public readonly name: string
  public readonly teamUsers: TeamUserDTO[]
  public constructor(props: {
    id: string
    name: string
    teamUsers: TeamUserDTO[]
  }) {
    const { id, name, teamUsers } = props
    this.id = id
    this.name = name
    this.teamUsers = teamUsers
  }
}

export type TeamUserDTO = {
  id: string
}
