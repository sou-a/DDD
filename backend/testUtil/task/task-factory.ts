import * as faker from 'faker'
import { Task } from 'src/domain/entity/task/task'

export const createTask = (params: {
  id?: string
  name?: string
  taskGroupId?: string
}) => {
  const { id, name, taskGroupId } = params
  return new Task({
    id: id ?? faker.random.uuid(),
    name: name ?? 'A',
    taskGroupId: taskGroupId ?? faker.random.uuid(),
  })
}
