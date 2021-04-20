import { Pair } from './pair'

export interface IPairRepository {
  findAll(): Promise<Pair[]>
  findById(pairId: string): Promise<Pair>
  save(pair: Pair): Promise<Pair>
  delete(pairId: string): Promise<void>
}
