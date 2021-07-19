import * as faker from 'faker'
import { prisma } from 'src/__tests__/testUtil/prisma'
import { Task } from 'src/domain/task/task'
import { TaskId } from 'src/domain/task/task-id'

export const seedTask = async (params: {
  id?: string
  name?: string
  taskGroupId?: string
}) => {
  let { name, taskGroupId } = params
  const id = params.id ?? faker.random.uuid()
  name = name ?? 'A'
  taskGroupId = taskGroupId ?? faker.random.uuid()
  await prisma.task.create({
    data: {
      id,
      name,
      taskGroupId,
    },
  })
  return new Task({ id: new TaskId(id), name, taskGroupId })
}
