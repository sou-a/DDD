export class PairDTO {
  public readonly id: string
  public readonly name: string
  public readonly pairUsers: PairUserDTO[]
  public constructor(props: {
    id: string
    name: string
    pairUsers: PairUserDTO[]
  }) {
    const { id, name, pairUsers } = props
    this.id = id
    this.name = name
    this.pairUsers = pairUsers
  }
}

export type PairUserDTO = {
  id: string
  status: string
}
