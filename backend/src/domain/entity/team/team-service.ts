import { Team } from './team'
import { ITeamRepository } from './i-team-repository'
import { TeamUser } from './team-user'

export class TeamService {
  private teamRepository: ITeamRepository
  public constructor(props: { teamRepository: ITeamRepository }) {
    const { teamRepository } = props

    this.teamRepository = teamRepository
  }
  /**
   * チームユーザーを削除する
   * @param user
   */
  public reduceTeamUser(team: Team, userId: string): void {
    const resultTeamUsers = team
      .getAllProperties()
      .TeamUsers.filter((teamUser: TeamUser) => {
        teamUser.getAllProperties().userId !== userId
      })

    // もし2名以下になった場合チームは存続できず、他のチームに合併する必要がある。合併先は、最も参加人数が少ないチームから優先的に選ばれる
    if (resultTeamUsers.length < Team.lowerLimit) {
      // 最も参加人数が少ないチームを選ぶ
      const mergeTeamId = this.teamRepository
        .findMostLeastTeam()
        .getAllProperties().id

      // 合併処理
      resultTeamUsers.filter((teamUser: TeamUser) => {
        teamUser.changeTeamId(mergeTeamId)
      })

      // 存続できないチームを削除
      this.teamRepository.delete(team.getAllProperties().id)
    } else {
      team.changeTeamUsers(resultTeamUsers)
    }
  }
}
