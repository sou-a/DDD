import { ApiProperty } from '@nestjs/swagger'
import { TeamDTO, TeamUserDTO } from 'src/app/dto/team-dto'

export class FindAllTeamResponse {
  @ApiProperty({ type: () => [Team] })
  teams: Team[]

  public constructor(params: { teamDTOs: TeamDTO[] }) {
    const { teamDTOs } = params
    this.teams = teamDTOs.map(({ id, name, teamUsers }) => {
      return new Team({
        id: id.value,
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
  teamUsers: TeamUserDTO[]

  public constructor(params: {
    id: string
    name: string
    teamUsers: TeamUserDTO[]
  }) {
    this.id = params.id
    this.name = params.name
    this.teamUsers = params.teamUsers
  }
}
