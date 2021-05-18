import { Team } from './team'
import { ITeamRepository } from './i-team-repository'
import { IUserRepository } from '../user/i-user-repository'
import { User } from '../user/user'

export class TeamService {
  private teamRepository: ITeamRepository
  private userRepository: IUserRepository
  public constructor(props: {
    teamRepository: ITeamRepository
    userRepository: IUserRepository
  }) {
    const { teamRepository, userRepository } = props

    this.teamRepository = teamRepository
    this.userRepository = userRepository
  }

  /**
   * TODO: saveはドメインサービスでするべきか、ユースケースでするべきか
   * TODO: 仕様を書きたいので、ゴチャゴチャ手続き的に書きたくない。
   *
   * チームユーザーを削除する（saveもします）
   * @param user
   */
  public async deleteTeamUserAndSave(
    team: Team,
    userId: string,
  ): Promise<Team> {
    const resultTeam = team.removeTeamUser(userId)

    // もし2名以下になった場合チームは存続できず、他のチームに合併する必要がある。合併先は、最も参加人数が少ないチームから優先的に選ばれる
    if (resultTeam.getAllProperties().teamUsers.length >= Team.lowerLimit) {
      return await this.teamRepository.save(team)
    } else {
      // 最も参加人数が少ないチームを選ぶ
      // TODO: fix: 自分（存続できないチーム(resultTeam)）が選ばれる可能性がある
      const mostLeastTeam = await this.teamRepository.findMostLeastTeam()

      // TODO: 最も参加人数が少ないチームは複数いる可能性があるが、それを決めるロジックがリポジトリのfindMostLeastTeam()に入ってしまっている
      const mergeTeam = mostLeastTeam

      if (!mergeTeam) {
        // もし自動的に合併できない（例：プラハチャレンジ全体の参加者が2名しかいない）場合は合併せず、エラーも発生しない
        return team
      }

      // 合併処理
      const users: User[] = await Promise.all(
        resultTeam.getAllProperties().teamUsers.map((teamUser) => {
          return this.userRepository.findById(
            teamUser.getAllProperties().userId,
          )
        }),
      )
      users.map((user: User) => {
        mergeTeam.addTeamUser(user)
      })

      // 存続できないチームを削除
      this.teamRepository.delete(resultTeam.getAllProperties().id)

      // TODO: ↑と↓で１トランザクションになっているか確認したい
      return await this.teamRepository.save(mergeTeam)
    }
  }
}
