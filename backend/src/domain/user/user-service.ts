import { IPairRepository } from '../pair/i-pair-repository'
import { Pair } from '../pair/pair'
import { ITeamRepository } from '../team/i-team-repository'
import { Team } from '../team/team'
import { TeamService } from '../team/team-service'
import { IUserRepository } from './i-user-repository'
import { UserId } from './user-id'

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

  public async deleteUser(userId: UserId): Promise<boolean> {
    // ペアユーザー削除（ペアオブジェクト生成してそこに任せる）
    const pair: Pair | null = await this.pairRepository.findByUserId(userId)
    if (pair) {
      const resultPair: Pair = pair.removePairUser(userId)
      await this.pairRepository.save(resultPair)
    }

    // チームユーザー削除
    const team: Team | null = await this.teamRepository.findByUserId(userId)
    if (team) {
      await this.teamService.deleteTeamUserAndSave(team, userId)
    }

    // ユーザー削除
    await this.userRepository.delete(userId)

    return true
  }
}
