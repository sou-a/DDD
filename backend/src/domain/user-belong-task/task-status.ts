import ValueObject from '../shared/value-object'

// - 課題には、参加者ごとに進捗ステータスがある
export class TaskStatus extends ValueObject<string, 'TaskStatus'> {
  // - 進捗ステータスは「未着手、レビュー待ち、完了」いずれかの値を持つ
  static notYet = '未着手'
  static review = 'レビュー待ち'
  static complete = '完了'
  static statusList = [
    TaskStatus.notYet,
    TaskStatus.review,
    TaskStatus.complete,
  ]

  constructor(value: string) {
    super(value)
    if (!TaskStatus.statusList.includes(value)) {
      throw new Error('存在しない在籍ステータスです')
    }
  }

  public getStatus(): string {
    return this.value
  }

  public isComplete(): boolean {
    return this.equals(new TaskStatus(TaskStatus.complete))
  }
}
