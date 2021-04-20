import { PrismaClient } from '@prisma/client'
import { ITeamRepository } from 'src/domain/entity/team/i-team-repository'
import { Team } from 'src/domain/entity/team/team'
import { TeamUser } from 'src/domain/entity/team/team-user'
import { User } from 'src/domain/entity/user/user'

export class TeamRepository implements ITeamRepository {
  private prismaClient: PrismaClient

  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient
  }

  public async findAll(): Promise<Team[]> {
    const models = await this.prismaClient.team.findMany({
      include: {
        users: {
          include: {
            user: true,
          },
        },
      },
    })
    const entities: Team[] = models.map(
      (model): Team => {
        const users = model.users.map((teamUser) => {
          return new User({
            id: teamUser.user.id,
            name: teamUser.user.name,
            mailAddress: teamUser.user.mailAddress,
            status: teamUser.user.userStatusId,
          })
        })
        return new Team({
          id: model.id,
          name: model.name,
          users: users,
        })
      },
    )
    return entities
  }

  public async findById(teamId: string): Promise<Team> {
    const model = await this.prismaClient.team.findUnique({
      where: {
        id: teamId,
      },
      include: {
        users: {
          include: {
            user: true,
          },
        },
      },
    })
    if (model === null) {
      throw new Error(`${teamId}が見つかりませんでした`)
    }

    const users = model.users.map((teamUser) => {
      return new User({
        id: teamUser.user.id,
        name: teamUser.user.name,
        mailAddress: teamUser.user.mailAddress,
        status: teamUser.user.userStatusId,
      })
    })

    const entity = new Team({
      id: model.id,
      name: model.name,
      users: users,
    })
    return entity
  }

  public async findByName(name: string): Promise<Team> {
    const model = await this.prismaClient.team.findFirst({
      where: {
        name: name,
      },
      include: {
        users: {
          include: {
            user: true,
          },
        },
      },
    })
    if (model === null) {
      throw new Error(`${name}が見つかりませんでした`)
    }

    const users = model.users.map((teamUser) => {
      return new User({
        id: teamUser.user.id,
        name: teamUser.user.name,
        mailAddress: teamUser.user.mailAddress,
        status: teamUser.user.userStatusId,
      })
    })

    const entity = new Team({
      id: model.id,
      name: model.name,
      users: users,
    })
    return entity
  }

  public async findMostLeastTeam(): Promise<Team[]> {
    const models = await this.prismaClient.team.findMany({
      include: {
        users: {
          include: {
            user: true,
          },
        },
        _count: {
          select: { users: true },
        },
      },
      where: {
        users: {}, // ユーザーが最小のチームを取得したい...!!
      },
    })
    if (models === null) {
      throw new Error(`見つかりませんでした`)
    }

    const entities: Team[] = models.map(
      (model): Team => {
        const users = model.users.map((teamUser) => {
          return new User({
            id: teamUser.user.id,
            name: teamUser.user.name,
            mailAddress: teamUser.user.mailAddress,
            status: teamUser.user.userStatusId,
          })
        })
        return new Team({
          id: model.id,
          name: model.name,
          users: users,
        })
      },
    )
    return entities
  }

  public async save(team: Team): Promise<Team> {
    const { id, name, teamUsers } = team.getAllProperties()

    const model = await this.prismaClient.team.create({
      data: {
        id,
        name,
        users: {
          create: teamUsers.map((teamUser: TeamUser) => {
            return teamUser.getAllProperties()
          }),
        },
      },
      include: {
        users: {
          include: {
            user: true,
          },
        },
      },
    })

    const userEntity = model.users.map((teamUser) => {
      return new User({
        id: teamUser.user.id,
        name: teamUser.user.name,
        mailAddress: teamUser.user.mailAddress,
        status: teamUser.user.name,
      })
    })
    const entity = new Team({
      id: model.id,
      name: model.name,
      users: userEntity,
    })
    return entity
  }

  public async delete(teamId: string): Promise<void> {
    await this.prismaClient.team.delete({
      where: {
        id: teamId,
      },
    })
  }
}
