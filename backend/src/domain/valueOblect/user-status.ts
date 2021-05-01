export class UserStatus {
  private status

  static statusList = ['在籍中', '休会中', '退会済']
  static active = '在籍中'

  constructor(status: string) {
    if (!UserStatus.statusList.includes(status)) {
      throw new Error('存在しない在籍ステータスです')
    }
    this.status = status
  }

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
