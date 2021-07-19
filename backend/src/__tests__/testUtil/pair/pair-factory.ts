import * as faker from 'faker'
import { Pair } from 'src/domain/pair/pair'
import { PairId } from 'src/domain/pair/pair-id'
import { User } from 'src/domain/user/user'
import { createUser } from 'src/__tests__/testUtil/user/user-factory'

export const createPair = (params: {
  id?: string
  name?: string
  users?: User[]
}) => {
  let { name, users } = params
  const id = params.id ?? faker.random.uuid()
  name = name ?? `${faker.random.alpha()}`
  users = users ?? [createUser({}), createUser({})]
  return new Pair({ id: new PairId(id), name, users })
}
