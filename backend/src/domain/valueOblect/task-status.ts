// - 課題には、参加者ごとに進捗ステータスがある
export class TaskStatus {
  private status: string

  // - 進捗ステータスは「未着手、レビュー待ち、完了」いずれかの値を持つ
  static notYet = '未着手'
  static review = 'レビュー待ち'
  static complete = '完了'
  static statusList = [
    TaskStatus.notYet,
    TaskStatus.review,
    TaskStatus.complete,
  ]

  constructor(status: string) {
    if (!TaskStatus.statusList.includes(status)) {
      throw new Error('存在しない在籍ステータスです')
    }
    this.status = status
  }

  public getStatus(): string {
    return this.status
  }

  public isComplete(): boolean {
    return this.isEquals(new TaskStatus(TaskStatus.complete))
  }

  public isEquals(status: TaskStatus): boolean {
    return this.status === status.status
  }
}
