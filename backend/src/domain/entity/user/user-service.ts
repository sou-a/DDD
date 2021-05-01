import { IPairRepository } from '../pair/i-pair-repository'
import { Pair } from '../pair/pair'
import { ITeamRepository } from '../team/i-team-repository'
import { Team } from '../team/team'
import { TeamService } from '../team/team-service'
import { IUserRepository } from './i-user-repository'

export class UserService {
  userRepository: IUserRepository
  pairRepository: IPairRepository
  teamRepository: ITeamRepository
  teamService: TeamService
  constructor(props: {
    userRepository: IUserRepository
    pairRepository: IPairRepository
    teamRepository: ITeamRepository
    teamService: TeamService
  }) {
    const {
      userRepository,
      pairRepository,
      teamRepository,
      teamService,
    } = props

    this.userRepository = userRepository
    this.pairRepository = pairRepository
    this.teamRepository = teamRepository
    this.teamService = teamService
  }

  public async deleteUser(userId: string) {
    // ペアユーザー削除（ペアオブジェクト生成してそこに任せる）
    const pair: Pair = await this.pairRepository.findByUserId(userId)
    const resultPair: Pair = pair.deletePairUser(userId)
    this.pairRepository.save(resultPair)

    // チームユーザー削除
    const team: Team = await this.teamRepository.findByUserId(userId)
    const resultTeam: Team = await this.teamService.deleteTeamUser(team, userId)
    this.teamRepository.save(resultTeam)

    // ユーザー削除
    this.userRepository.delete(userId)
  }
}
