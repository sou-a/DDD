import { Team } from './team'
import { ITeamRepository } from './i-team-repository'
import { TeamUser } from './team'

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
  public async deleteTeamUser(team: Team, userId: string): Promise<Team> {
    if (team.getAllProperties().teamUsers.length === Team.lowerLimit) {
      throw new Error(`参加者は${Team.lowerLimit}名以上必要です`)
    }
    const resultTeamUsers = team
      .getAllProperties()
      .teamUsers.filter((teamUser: TeamUser) => {
        teamUser.getAllProperties().userId !== userId
      })

    // もし2名以下になった場合チームは存続できず、他のチームに合併する必要がある。合併先は、最も参加人数が少ないチームから優先的に選ばれる
    if (resultTeamUsers.length >= Team.lowerLimit) {
      return team
    } else {
      // 最も参加人数が少ないチームを選ぶ
      const mergeTeam = await this.teamRepository.findMostLeastTeams()

      // 最も参加人数が少ないチームは複数いる可能性があるが、仕様にないので今回はとりあえず配列の最初のチームにする
      if (!mergeTeam[0]) {
        throw new Error('チームがいない')
      }
      const mergeTeamId = mergeTeam[0].getAllProperties().id

      // 合併処理
      resultTeamUsers.filter((teamUser: TeamUser) => {
        teamUser.changeTeamId(mergeTeamId)
      })

      // 存続できないチームを削除
      this.teamRepository.delete(team.getAllProperties().id)

      return team
    }
  }
}
