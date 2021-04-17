import { User } from '../user/user'
import { PairUser } from './pair-user'

export class Pair {
  private id: string
  private name: string
  private pairUsers: Array<PairUser>

  lowerLimit = 2
  upperLimit = 3
  alphabetRegex = /^[A-Za-z]*$/

  public constructor(props: { id: string; name: string; users: Array<User> }) {
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
  public addPairUser(user: User): void {
    const userProperties = user.getAllProperties()

    const teamUser = new PairUser({
      pairId: this.id,
      userId: userProperties.id,
      status: userProperties.status,
    })
    this.pairUsers.push(teamUser)
  }
}
