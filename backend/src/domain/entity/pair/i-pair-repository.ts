import { Pair } from './pair'

export interface IPairRepository {
  findAll(): Promise<Pair[]>
  findById(pairId: string): Promise<Pair>
  findByUserId(userId: string): Promise<Pair>
  save(pair: Pair): Promise<Pair>
  delete(pairId: string): Promise<void>
  deletePairUser(userId: string): Promise<void>
}
