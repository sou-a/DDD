import * as faker from 'faker'
import { prisma } from '@testUtil/prisma'

export const seedTaskGroup = async (params: { id?: string; name?: string }) => {
  let { id, name } = params
  id = id ?? faker.random.uuid()
  name = name ?? 'A'
  await prisma.taskGroup.create({
    data: {
      id,
      name,
    },
  })
}
