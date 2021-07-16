import * as faker from 'faker'
import { prisma } from 'src/__tests__/testUtil/prisma'
import { TaskGroup } from 'src/domain/task-group/task-group'

export const seedTaskGroup = async (params: { id?: string; name?: string }) => {
  let { id, name } = params
  id = id ?? faker.random.uuid()
  name = name ?? 'A'
  const taskGroup = await prisma.taskGroup.create({
    data: {
      id,
      name,
    },
    include: {
      tasks: true,
    },
  })
  const tasks = taskGroup.tasks.map((task) => {
    return task.id
  })
  return new TaskGroup({ id, name, tasks })
}
