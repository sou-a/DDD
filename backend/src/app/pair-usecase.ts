import { IPairRepository } from 'src/domain/entity/pair/i-pair-repository'
import { Pair } from 'src/domain/entity/pair/pair'
import { IUserRepository } from 'src/domain/entity/user/i-user-repository'
import { User } from 'src/domain/entity/user/user'
import { createRandomIdString } from 'src/util/random'

// ペアの一覧取得、新規追加、更新（少なくとも所属する参加者を変更できること）、削除
export class PairUseCase {
  private pairRepository: IPairRepository
  private userRepository: IUserRepository

  public constructor(
    pairRepository: IPairRepository,
    userRepository: IUserRepository,
  ) {
    this.pairRepository = pairRepository
    this.userRepository = userRepository
  }

  public async findAll(): Promise<Pair[]> {
    try {
      return await this.pairRepository.findAll()
    } catch (error) {
      throw error
    }
  }

  public async save(name: string, userIds: string[]): Promise<Pair> {
    const users: User[] = await Promise.all(
      // TODO: IDsで複数検索したい
      userIds.map((userId) => {
        return this.userRepository.findById(userId)
      }),
    )
    const pair = new Pair({
      id: createRandomIdString(),
      name,
      users,
    })

    try {
      return this.pairRepository.save(pair)
    } catch (error) {
      throw error
    }
  }

  public async upsert(
    name: string,
    pairId: string,
    userIds: string[],
  ): Promise<Pair> {
    const users: User[] = await Promise.all(
      userIds.map((userId) => {
        return this.userRepository.findById(userId)
      }),
    )
    const pair: Pair = new Pair({
      id: createRandomIdString(),
      name: name,
      users,
    })
    try {
      return await this.pairRepository.save(pair)
    } catch (error) {
      throw error
    }
  }

  public async changeUser(pairId: string, userId: string): Promise<void> {
    const user: User = await this.userRepository.findById(userId)
    const pair: Pair = await this.pairRepository.findById(pairId)

    try {
      return pair.addPairUser(user)
    } catch (error) {
      throw error
    }
  }

  public async delete(pairId: string): Promise<void> {
    try {
      await this.pairRepository.delete(pairId)
    } catch (error) {
      throw error
    }
  }
}
