import * as faker from 'faker'
import { TaskGroup } from 'src/domain/entity/task-group/task-group'

export const createTaskGroup = async (params: {
  id?: string
  name?: string
  tasks?: string[]
}) => {
  let { id, name, tasks } = params
  id = id ?? faker.random.uuid()
  name = name ?? 'A'
  tasks = tasks ?? [
    faker.random.uuid(),
    faker.random.uuid(),
    faker.random.uuid(),
  ]
  return new TaskGroup({
    id,
    name,
    tasks,
  })
}
