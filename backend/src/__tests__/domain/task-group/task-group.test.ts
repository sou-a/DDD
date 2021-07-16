import { TaskGroup } from 'src/domain/task-group/task-group'
import { createRandomIdString } from 'src/util/random'

describe('task-group.ts', () => {
  describe('constructor', () => {
    it('[正常系]生成できる', () => {
      expect(
        new TaskGroup({
          id: createRandomIdString(),
          name: 'タスク',
          tasks: ['1', '2'],
        }),
      ).toEqual(expect.any(TaskGroup))
    })
  })
  describe('changeName', () => {
    it('[正常系]名前を変更できる', () => {
      const taskGroup = new TaskGroup({
        id: createRandomIdString(),
        name: 'タスクグループ',
        tasks: ['1', '2'],
      })
      taskGroup.changeName('変更後のタスクグループ')
      expect(taskGroup.getAllProperties().name).toEqual(
        '変更後のタスクグループ',
      )
    })
  })
})
