import { PairUser } from 'src/domain/entity/pair/pair'
export class PairDTO {
  public readonly id: string
  public readonly name: string
  public readonly pairUsers: PairUser[]
  public constructor(props: {
    id: string
    name: string
    pairUsers: PairUser[]
  }) {
    const { id, name, pairUsers } = props
    this.id = id
    this.name = name
    this.pairUsers = pairUsers
  }
}
