export class UserStatus {
  private status

  static active = '在籍中'
  static recess = '休会中'
  static leave = '退会済'
  static statusList = [UserStatus.active, UserStatus.recess, UserStatus.leave]

  constructor(status: string) {
    if (!UserStatus.statusList.includes(status)) {
      throw new Error('存在しない在籍ステータスです')
    }
    this.status = status
  }

  // TODO: 値オブジェクトでgetterは用意して良いのだろうか...？
  public getStatus() {
    return this.status
  }

  public isActive(): boolean {
    return this.isEquals(new UserStatus(UserStatus.active))
  }

  public isEquals(status: UserStatus): boolean {
    return this.status === status.status
  }
}
