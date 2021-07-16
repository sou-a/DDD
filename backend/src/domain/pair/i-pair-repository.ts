import { Pair } from './pair'

export interface IPairRepository {
  findAll(): Promise<Pair[]>
  findById(pairId: string): Promise<Pair>
  findByUserId(userId: string): Promise<Pair | null>
  save(pair: Pair): Promise<Pair>
  delete(pairId: string): Promise<boolean>
  deletePairUser(userId: string): Promise<void>
}
