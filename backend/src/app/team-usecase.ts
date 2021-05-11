import { ITeamRepository } from 'src/domain/entity/team/i-team-repository'
import { Team } from 'src/domain/entity/team/team'
import { TeamFactory } from 'src/domain/entity/team/team-factory'
import { TeamService } from 'src/domain/entity/team/team-service'
import { IUserRepository } from 'src/domain/entity/user/i-user-repository'
import { User } from 'src/domain/entity/user/user'
import { TeamDTO } from './dto/team-dto'

// チームの一覧取得、新規追加、更新（少なくとも所属するペアを変更できること）、削除
export class TeamUseCase {
  private teamRepository: ITeamRepository
  private userRepository: IUserRepository
  private teamService: TeamService
  private teamFactory: TeamFactory

  public constructor(
    teamRepository: ITeamRepository,
    userRepository: IUserRepository,
    teamService: TeamService,
    teamFactory: TeamFactory,
  ) {
    this.teamRepository = teamRepository
    this.userRepository = userRepository
    this.teamService = teamService
    this.teamFactory = teamFactory
  }

  public async findAll(): Promise<TeamDTO[]> {
    try {
      const teams: Team[] = await this.teamRepository.findAll()
      return teams.map((team: Team) => {
        return new TeamDTO({ ...team.getAllProperties() })
      })
    } catch (error) {
      throw error
    }
  }

  public async create(props: {
    name: string
    userIds: string[]
  }): Promise<TeamDTO> {
    const { name, userIds } = props
    const users: User[] = await Promise.all(
      userIds.map((userId) => {
        return this.userRepository.findById(userId)
      }),
    )
    const team: Team = await this.teamFactory.createTeam({
      name,
      users,
    })
    try {
      const savedTeam = await this.teamRepository.save(team)
      return new TeamDTO({ ...savedTeam.getAllProperties() })
    } catch (error) {
      throw error
    }
  }

  public async createTeamUser(props: {
    teamId: string
    userId: string
  }): Promise<TeamDTO> {
    const { teamId, userId } = props

    const user: User = await this.userRepository.findById(userId)
    const team: Team = await this.teamRepository.findById(teamId)

    try {
      const addedTeamUser = team.addTeamUser(user)
      const savedTeam = await this.teamRepository.save(addedTeamUser)
      return new TeamDTO({ ...savedTeam.getAllProperties() })
    } catch (error) {
      throw error
    }
  }

  public async deleteTeamUser(props: {
    teamId: string
    userId: string
  }): Promise<TeamDTO> {
    const { teamId, userId } = props
    const user: User = await this.userRepository.findById(userId)
    const team: Team = await this.teamRepository.findById(teamId)

    try {
      const resultTeam = await this.teamService.deleteTeamUserAndSave(
        team,
        user.getAllProperties().id,
      )
      return new TeamDTO({ ...resultTeam.getAllProperties() })
    } catch (error) {
      throw error
    }
  }

  public delete(prop: { teamId: string }): Promise<void> {
    const { teamId } = prop

    try {
      return this.teamRepository.delete(teamId)
    } catch (error) {
      throw error
    }
  }
}
