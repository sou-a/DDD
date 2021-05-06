import { UserStatus } from 'src/domain/valueOblect/user-status'
import { User } from '../user/user'

export class Team {
  private id: string
  private name: string
  private teamUsers: TeamUser[]

  static lowerLimit = 3

  public constructor(props: { id: string; name: string; users: User[] }) {
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
  public addTeamUser(user: User): Team {
    const userProperties = user.getAllProperties()

    const teamUser = new TeamUser({
      teamId: this.id,
      userId: userProperties.id,
      status: userProperties.status,
    })
    this.teamUsers.push(teamUser)
    return this
  }

  /**
   * チームユーザーを削除する
   * @param user
   */
  public removeTeamUser(user: User): Team {
    this.teamUsers.filter((teamUser) => {
      return user.getAllProperties().id === teamUser.getAllProperties().userId
    })
    return this
  }

  public getAllProperties() {
    return {
      id: this.id,
      name: this.name,
      teamUsers: this.teamUsers,
    }
  }
}

// TODO: exportしないと別ファイル（ドメインサービス等）で型指定できない...
export class TeamUser {
  private teamId: string
  private userId: string
  private status: UserStatus

  public constructor(props: {
    teamId: string
    userId: string
    status: UserStatus
  }) {
    const { teamId, userId, status } = props

    // - 参加者の在籍ステータスが「休会中」か「退会済み」の場合どのチームにも所属してはいけない
    if (!status.isActive()) {
      throw new Error(
        `${UserStatus.active}ではないユーザーはチームに所属できません`,
      )
    }

    this.teamId = teamId
    this.userId = userId
    this.status = status
  }

  public changeTeamId(teamId: string) {
    this.teamId = teamId
  }

  public getAllProperties() {
    return {
      teamId: this.teamId,
      userId: this.userId,
      status: this.status,
    }
  }
}
