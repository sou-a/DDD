import { User } from '../user/user'

export class TeamUser {
  private teamId: string
  private userId: string
  private status: string

  public constructor(props: {
    teamId: string
    userId: string
    status: string
  }) {
    const { teamId, userId, status } = props

    // - 参加者の在籍ステータスが「休会中」か「退会済み」の場合どのチームにも所属してはいけない
    if (status !== User.active) {
      throw new Error(`${User.active}ではないユーザーはチームに所属できません`)
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
