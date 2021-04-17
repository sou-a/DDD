import { User } from '../user/user'
import { TeamUser } from './team-user'

export class Team {
  private id: string
  private name: string
  private teamUsers: Array<TeamUser>

  static lowerLimit = 3

  public constructor(props: { id: string; name: string; users: Array<User> }) {
    const { id, name, users } = props

    // ユーザーを詰め替えてチームユーザーインスタンス生成
    const teamUsers = users.map((user) => {
      const userProperties = user.getAllProperties()
      return new TeamUser({
        teamId: this.id,
        userId: userProperties.id,
        status: userProperties.status,
      })
    })

    // - 名前がある（1,2,3,4のような数字でなければいけない。）
    if (!Number.isInteger(name)) {
      throw new Error('チーム名は数字のみです')
    }

    // - 参加者3名以上から成る
    if (teamUsers.length < Team.lowerLimit) {
      throw new Error(`参加者は${Team.lowerLimit}名以上必要です`)
    }

    this.id = id
    this.name = name
    this.teamUsers = teamUsers
  }

  /**
   * チームユーザーを追加する
   * @param user
   */
  public addTeamUser(user: User): void {
    const userProperties = user.getAllProperties()

    const teamUser = new TeamUser({
      teamId: this.id,
      userId: userProperties.id,
      status: userProperties.status,
    })
    this.teamUsers.push(teamUser)
  }

  public changeTeamUsers(teamUsers: Array<TeamUser>) {
    this.teamUsers = teamUsers
  }

  public getAllProperties() {
    return {
      id: this.id,
      name: this.name,
      TeamUsers: this.teamUsers,
    }
  }
}
