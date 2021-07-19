import { UserStatus } from 'src/domain/user/user-status'
import { User } from '../user/user'
import { UserId } from '../user/user-id'
import { TeamId } from './team-id'

export class Team {
  private id: TeamId
  private name: string
  private teamUsers: TeamUser[]

  static lowerLimit = 3
  static numberRegex = /^[0-9]+$/

  public constructor(props: { id: TeamId; name: string; users: User[] }) {
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
    if (name.match(Team.numberRegex) === null) {
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
   *
   * チームユーザーを削除する
   * @param userId
   */
  public removeTeamUserFromTeamService(userId: UserId): Team {
    const removeTeamUser = this.teamUsers.filter(
      (teamUser) => !userId.equals(teamUser.getAllProperties().userId),
    )
    this.teamUsers = removeTeamUser
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

class TeamUser {
  private teamId: TeamId
  private userId: UserId
  private status: UserStatus

  public constructor(props: {
    teamId: TeamId
    userId: UserId
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

  public getAllProperties() {
    return {
      teamId: this.teamId,
      userId: this.userId,
      status: this.status,
    }
  }
}
