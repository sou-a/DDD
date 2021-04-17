import { User } from '../user/user'

export class PairUser {
  private pairId: string
  private userId: string
  private status: string

  public constructor(props: {
    pairId: string
    userId: string
    status: string
  }) {
    const { pairId, userId, status } = props

    // - 参加者の在籍ステータスが「休会中」か「退会済み」の場合どのペアにも所属してはいけない
    if (status !== User.active) {
      throw new Error(`${User.active}ではないユーザーはペアに所属できません`)
    }

    this.pairId = pairId
    this.userId = userId
    this.status = status
  }
}
