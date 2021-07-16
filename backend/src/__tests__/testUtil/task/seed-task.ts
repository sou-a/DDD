import * as faker from 'faker'
import { prisma } from 'src/__tests__/testUtil/prisma'
import { Task } from 'src/domain/task/task'

export const seedTask = async (params: {
  id?: string
  name?: string
  taskGroupId?: string
}) => {
  let { id, name, taskGroupId } = params
  id = id ?? faker.random.uuid()
  name = name ?? 'A'
  taskGroupId = taskGroupId ?? faker.random.uuid()
  await prisma.task.create({
    data: {
      id,
      name,
      taskGroupId,
    },
  })
  return new Task({ id, name, taskGroupId })
}
