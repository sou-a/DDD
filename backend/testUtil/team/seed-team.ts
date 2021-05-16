import * as faker from 'faker'
import { prisma } from '@testUtil/prisma'
import { seedUser } from '@testUtil/user/seed-user'
import { Team } from 'src/domain/entity/team/team'
import { User } from 'src/domain/entity/user/user'

export const seedTeam = async (params: { id?: string; name?: string }) => {
  let { id, name } = params
  id = id ?? faker.random.uuid()
  name = name ?? `${faker.random.number()}`
  await prisma.team.create({
    data: {
      id,
      name,
    },
  })
}

export const seedTeamAndUsers = async (params: {
  id?: string
  name?: string
  users?: User[]
}) => {
  let { id, name } = params
  const { users } = params

  id = id ?? faker.random.uuid()
  name = name ?? `${faker.random.number()}`

  await prisma.team.create({
    data: {
      id,
      name,
    },
  })

  if (users) {
    await Promise.all(
      users.map(async (user: User) => {
        id = id ?? faker.random.uuid()
        await seedUser({
          id: user.getAllProperties().id,
        })
        await prisma.teamUser.create({
          data: {
            userId: user.getAllProperties().id,
            teamId: id,
          },
        })
      }),
    )
    return new Team({ id, name, users })
  }

  const userId = faker.random.uuid()
  const userId2 = faker.random.uuid()
  const userId3 = faker.random.uuid()
  const user1 = await seedUser({
    id: userId,
  })
  const user2 = await seedUser({
    id: userId2,
  })
  const user3 = await seedUser({
    id: userId3,
  })

  await prisma.teamUser.createMany({
    data: [
      {
        userId,
        teamId: id,
      },
      {
        userId: userId2,
        teamId: id,
      },
      {
        userId: userId3,
        teamId: id,
      },
    ],
  })
  return new Team({ id, name, users: [user1, user2, user3] })
}
