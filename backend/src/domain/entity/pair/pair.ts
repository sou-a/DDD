import { UserStatus } from 'src/domain/valueOblect/user-status'
import { User } from '../user/user'

export class Pair {
  private id: string
  private name: string
  private pairUsers: PairUser[]

  lowerLimit = 2
  upperLimit = 3
  alphabetRegex = /^[A-Za-z]*$/

  public constructor(props: { id: string; name: string; users: User[] }) {
    const { id, name, users } = props

    // ユーザーを詰め替えてペアユーザーインスタンス生成
    const pairUsers = users.map((user) => {
      const userProperties = user.getAllProperties()

      return new PairUser({
        pairId: this.id,
        userId: userProperties.id,
        status: userProperties.status,
      })
    })

    // - 名前がある（a,b,c,d,eのような英文字でなければいけない）
    if (name.match(this.alphabetRegex) === null) {
      throw new Error('ペア名は英字のみです')
    }

    // - 参加者2名以上から成る
    if (pairUsers.length < this.lowerLimit) {
      throw new Error(`ペアユーザーは${this.lowerLimit}名以上必要です`)
    }

    // - 上限は3名まで。4名以上のペアは存続できない（他のペアに合併する必要がある）
    if (pairUsers.length > this.upperLimit) {
      throw new Error(
        `ペアユーザーは${this.upperLimit}名以下である必要があります`,
      )
    }

    this.id = id
    this.name = name
    this.pairUsers = pairUsers
  }

  /**
   * ペアユーザーを追加する
   * @param user
   */
  public addPairUser(user: User): Pair {
    // - 上限は3名まで。4名以上のペアは存続できない（他のペアに合併する必要がある）
    if (this.pairUsers.length === this.upperLimit) {
      throw new Error(
        `ペアユーザーは${this.upperLimit}名以下である必要があります`,
      )
    }
    const userProperties = user.getAllProperties()

    const teamUser = new PairUser({
      pairId: this.id,
      userId: userProperties.id,
      status: userProperties.status,
    })
    this.pairUsers.push(teamUser)
    return this
  }

  /**
   * ペアユーザーを削除する
   * @param user
   */
  public removePairUser(userId: string): Pair {
    const removedPairUser = this.pairUsers.filter(
      (pairUser) => userId !== pairUser.getAllProperties().userId,
    )
    // - 参加者2名以上から成る（TODO: 生成時のルールと重複）
    if (removedPairUser.length < this.lowerLimit) {
      throw new Error(`ペアユーザーは${this.lowerLimit}名以上必要です`)
    }
    this.pairUsers = removedPairUser
    return this
  }

  public getAllProperties() {
    return {
      id: this.id,
      name: this.name,
      pairUsers: this.pairUsers,
    }
  }
}

// TODO: exportしないとリポジトリで型指定できない（interfaceだとprivateなプロパティはうまくいかない）
export class PairUser {
  private pairId: string
  private userId: string
  private status: UserStatus

  public constructor(props: {
    pairId: string
    userId: string
    status: UserStatus
  }) {
    const { pairId, userId, status } = props

    // - 参加者の在籍ステータスが「休会中」か「退会済み」の場合どのペアにも所属してはいけない
    if (!status.isActive()) {
      throw new Error(
        `${UserStatus.active}ではないユーザーはペアに所属できません`,
      )
    }

    this.pairId = pairId
    this.userId = userId
    this.status = status
  }

  public getAllProperties() {
    return {
      pairId: this.pairId,
      userId: this.userId,
      status: this.status,
    }
  }
}
