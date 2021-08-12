import { IPairRepository } from '../pair/i-pair-repository'
import { Pair } from '../pair/pair'
import { ITeamRepository } from '../team/i-team-repository'
import { Team } from '../team/team'
import { TeamService } from '../team/team-service'
import { IUserRepository } from './i-user-repository'
import { User } from './user'
import { UserId } from './user-id'
import { UserStatus } from './user-status'

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

  public async changeStatus(user: User, status: UserStatus): Promise<User> {
    const pair: Pair | null = await this.pairRepository.findByUserId(
      user.getAllProperties().id,
    )
    const team: Team | null = await this.teamRepository.findByUserId(
      user.getAllProperties().id,
    )
    // - ステータスが「在籍中」以外の場合、どのチームにもペアにも所属してはいけない
    if (!status.isActive() && (pair || team)) {
      throw new Error(
        `チームまたはペアに所属しているため${status.value}ステータスに変更できません`,
      )
    }

    return user.changeStatusFromUserService(status)
  }

  public async deleteUser(userId: UserId): Promise<void> { // ここの引数はドメインオブジェクトの引数になっていますね！コントローラーでもドメインオブジェクトを呼び出しているようですが、ドメイン情報がコントローラ層まで出てしまうのはよくなさそうです〜👀
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
  }
}
