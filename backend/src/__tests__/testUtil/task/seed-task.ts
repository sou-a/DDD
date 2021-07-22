import { prisma } from '@testUtil/prisma'
import * as faker from 'faker'
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
