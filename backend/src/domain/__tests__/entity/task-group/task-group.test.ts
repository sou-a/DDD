import { TaskGroup } from 'src/domain/entity/task-group/task-group'
import { createRandomIdString } from 'src/util/random'

describe('task-group.ts', () => {
  describe('constructor', () => {
    describe('[正常系]生成できる', () => {
      new TaskGroup({
        id: createRandomIdString(),
        name: 'タスク',
        tasks: ['1', '2'],
      })
    })
  })
})
