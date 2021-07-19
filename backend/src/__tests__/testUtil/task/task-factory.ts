import * as faker from 'faker'
import { Task } from 'src/domain/task/task'
import { TaskId } from 'src/domain/task/task-id'

export const createTask = (params: {
  id?: string
  name?: string
  taskGroupId?: string
}) => {
  const { name, taskGroupId } = params
  const id = params.id ?? faker.random.uuid()
  return new Task({
    id: new TaskId(id),
    name: name ?? 'A',
    taskGroupId: taskGroupId ?? faker.random.uuid(),
  })
}
