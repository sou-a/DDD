import { Injectable } from '@nestjs/common'
import { IPairRepository } from '../pair/i-pair-repository'
import { ITeamRepository } from '../team/i-team-repository'
import { IUserRepository } from './i-user-repository'

@Injectable()
export class UserService {
  private userRepository: IUserRepository
  private pairRepository: IPairRepository
  private teamRepository: ITeamRepository

  public constructor(props: {
    userRepository: IUserRepository
    pairRepository: IPairRepository
    teamRepository: ITeamRepository
  }) {
    const { userRepository, pairRepository, teamRepository } = props

    this.userRepository = userRepository
    this.pairRepository = pairRepository
    this.teamRepository = teamRepository
  }

  public delete(userId: string) {
    // ユーザー削除
    this.userRepository.delete(userId)

    // ペアユーザー削除
    this.pairRepository.delete(userId)

    // チームユーザー削除
    this.teamRepository.delete(userId)
  }
}
