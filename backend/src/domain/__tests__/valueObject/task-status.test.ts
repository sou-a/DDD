import { TaskStatus } from 'src/domain/valueOblect/task-status'

describe('task-status.ts', () => {
  describe('constructor', () => {
    it('[正常系]statusListにあるステータスはインスタンス生成できる', () => {
      const statusList = TaskStatus.statusList
      expect(
        statusList.map((status) => {
          new TaskStatus(status)
        }),
      ).resolves.toBe(undefined)
    })

    it('[準正常系]statusListにあるステータス以外のものはインスタンス生成できない', () => {
      const statusList = ['1', 'テストステータス']
      expect(
        statusList.map((status) => {
          new TaskStatus(status)
        }),
      ).resolves.toBe(undefined)
    })
  })

  describe('getStatus', () => {
    it('[正常系]ステータスを取得できる', () => {
      const status: string | undefined = TaskStatus.statusList[0]
      if (status) {
        const taskStatus = new TaskStatus(status)
        expect(taskStatus.getStatus()).resolves.toBe(status)
      }
    })
  })

  describe('isActive', () => {
    it('[正常系]完了の場合true', () => {
      const taskStatus = new TaskStatus(TaskStatus.complete)
      expect(taskStatus.isComplete()).resolves.toBe(true)
    })
  })

  describe('isEquals', () => {
    it('[正常系]等価性の保証', () => {
      const taskStatus = new TaskStatus(TaskStatus.complete)
      expect(taskStatus.isEquals(taskStatus)).resolves.toBe(true)
    })
  })
})
