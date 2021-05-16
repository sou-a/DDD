import { UserBelongTask } from 'src/domain/entity/user-belong-task/user-belong-task'
import { TaskStatus } from 'src/domain/valueOblect/task-status'
import { createRandomIdString } from 'src/util/random'

describe('user-belong-task.ts', () => {
  describe('constructor', () => {
    it('[正常系]生成できる', () => {
      expect(
        new UserBelongTask({
          userId: createRandomIdString(),
          taskId: createRandomIdString(),
          status: new TaskStatus(TaskStatus.notYet),
        }),
      ).toEqual(expect.any(UserBelongTask))
    })
  })
  describe('changeStatus', () => {
    it('[正常系]進捗ステータスを変更できる', () => {
      const userBelongTask = new UserBelongTask({
        userId: '1',
        taskId: createRandomIdString(),
        status: new TaskStatus(TaskStatus.notYet),
      })
      userBelongTask.changeStatus('1', new TaskStatus(TaskStatus.complete))
    })
    it('[準正常系]一度「完了」にした進捗ステータスを他のステータスに戻すことはできない', () => {
      const userBelongTask = new UserBelongTask({
        userId: '1',
        taskId: createRandomIdString(),
        status: new TaskStatus(TaskStatus.complete),
      })
      expect(() =>
        userBelongTask.changeStatus('1', new TaskStatus(TaskStatus.notYet)),
      ).toThrow(Error)
    })
    it('[準正常系]課題の所有者以外は進捗ステータスを変更できない', () => {
      const userBelongTask = new UserBelongTask({
        userId: '1',
        taskId: createRandomIdString(),
        status: new TaskStatus(TaskStatus.notYet),
      })
      expect(() =>
        userBelongTask.changeStatus('2', new TaskStatus(TaskStatus.complete)),
      ).toThrow(Error)
    })
  })
})
