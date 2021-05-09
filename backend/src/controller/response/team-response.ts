import { ApiProperty } from '@nestjs/swagger'
import { TeamDTO } from 'src/app/dto/team-dto'
import { TeamUser } from 'src/domain/entity/team/team'

export class FindAllTeamResponse {
  @ApiProperty({ type: () => [Team] })
  teams: Team[]

  public constructor(params: { teamDTOs: TeamDTO[] }) {
    const { teamDTOs } = params
    this.teams = teamDTOs.map(({ id, name, teamUsers }) => {
      return new Team({
        id,
        name,
        teamUsers,
      })
    })
  }
}

class Team {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  teamUsers: TeamUser[]

  public constructor(params: {
    id: string
    name: string
    teamUsers: TeamUser[]
  }) {
    this.id = params.id
    this.name = params.name
    this.teamUsers = params.teamUsers
  }
}
