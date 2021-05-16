import * as faker from 'faker'
import { prisma } from '@testUtil/prisma'

export const seedPair = async (params: { id?: string; name?: string }) => {
  let { id, name } = params
  id = id ?? faker.random.uuid()
  name = name ?? `${faker.random.alpha()}`
  await prisma.pair.create({
    data: {
      id,
      name,
    },
  })
}

export const seedPairUser = async (params: {
  userId?: string
  pairId?: string
}) => {
  let { pairId, userId } = params

  pairId = pairId ?? faker.random.uuid()
  userId = userId ?? faker.random.uuid()

  await prisma.pairUser.create({
    data: {
      userId,
      pairId,
    },
  })
}
