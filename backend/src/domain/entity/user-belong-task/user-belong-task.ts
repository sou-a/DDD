export class UserBelongTask {
  private userId: string
  private taskId: string
  private status: string // - 課題には、参加者ごとに進捗ステータスがある

  static completeStatus = '完了' // - 進捗ステータスは「未着手、レビュー待ち、完了」いずれかの値を持つ

  public constructor(props: {
    userId: string
    taskId: string
    status: string // TODO: 「ステータス」型を独自で作れたような...
  }) {
    const { userId, taskId, status } = props

    this.userId = userId
    this.taskId = taskId
    this.status = status
  }

  public changeStatus(userId: string, status: string): void {
    // - 進捗ステータスはいつでも変更可能
    // - ただし一度「完了」にした進捗ステータスを「レビュー待ち」「未着手」に戻すことはできない
    if (this.status === UserBelongTask.completeStatus) {
      throw new Error(
        `${UserBelongTask.completeStatus}ステータスは変更できません`,
      )
    }

    // - 進捗ステータスを変更できるのは、課題の所有者だけ（Aさんの課題1の進捗ステータスを変えられるのはAさんだけ。Bさんが変更するのは不可能）
    if (this.userId !== userId) {
      throw new Error('課題の所有者ではないので変更できません')
    }

    this.status = status
  }

  public getAllProperties() {
    return {
      userId: this.userId,
      taskId: this.taskId,
      status: this.status,
    }
  }
}