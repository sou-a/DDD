import * as faker from 'faker'
import { prisma } from '@testUtil/prisma'
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

export const seedAllTaskStatus = async () => {
  const data = [
    {
      id: '1',
      name: '未着手',
    },
    {
      id: '2',
      name: 'レビュー待ち',
    },
    {
      id: '3',
      name: '完了',
    },
  ]

  await prisma.taskUserStatus.createMany({
    data: data,
  })
}
