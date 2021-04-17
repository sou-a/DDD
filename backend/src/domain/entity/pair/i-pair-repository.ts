import { Pair } from './pair'

export interface IPairRepository {
  findAll(): Array<Pair>
  save(): void
  delete(userId: string): void
}
