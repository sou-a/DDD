import { Task } from 'src/domain/task/task'
import { createRandomIdString } from 'src/util/random'

describe('task.ts', () => {
  describe('constructor', () => {
    it('[正常系]生成できる', () => {
      expect(
        new Task({
          id: createRandomIdString(),
          name: 'タスク',
          taskGroupId: createRandomIdString(),
        }),
      ).toEqual(expect.any(Task))
    })
  })
  describe('changeTaskGroupId', () => {
    it('[正常系]タスクグループIdを変更できる', () => {
      const task = new Task({
        id: createRandomIdString(),
        name: 'タスク',
        taskGroupId: createRandomIdString(),
      })
      task.changeTaskGroupId('1')
      expect(task.getAllProperties().taskGroupId).toEqual('1')
    })
  })
})
