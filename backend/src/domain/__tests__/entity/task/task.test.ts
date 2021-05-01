import { Task } from 'src/domain/entity/task/task'
import { createRandomIdString } from 'src/util/random'

describe('task.ts', () => {
  describe('constructor', () => {
    describe('[正常系]生成できる', () => {
      new Task({
        id: createRandomIdString(),
        name: 'タスク',
        taskGroupId: createRandomIdString(),
      })
    })
  })
})
