import * as faker from 'faker'
import { Pair } from 'src/domain/entity/pair/pair'
import { User } from 'src/domain/entity/user/user'
import { createUser } from '@testUtil/user/user-factory'

export const createPair = (params: {
  id?: string
  name?: string
  users?: User[]
}) => {
  let { id, name, users } = params
  id = id ?? faker.random.uuid()
  name = name ?? `${faker.random.alpha()}`
  users = users ?? [createUser({}), createUser({})]
  return new Pair({ id, name, users })
}
