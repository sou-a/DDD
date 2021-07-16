import { ApiProperty } from '@nestjs/swagger'
import { PairDTO, PairUserDTO } from 'src/app/dto/pair-dto'

export class FindAllPairResponse {
  @ApiProperty({ type: () => [Pair] })
  pairs: Pair[]

  public constructor(params: { pairDTOs: PairDTO[] }) {
    const { pairDTOs } = params
    this.pairs = pairDTOs.map(({ id, name, pairUsers }) => {
      return new Pair({
        id,
        name,
        pairUsers,
      })
    })
  }
}

class Pair {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  pairUsers: PairUserDTO[]

  public constructor(params: {
    id: string
    name: string
    pairUsers: PairUserDTO[]
  }) {
    this.id = params.id
    this.name = params.name
    this.pairUsers = params.pairUsers
  }
}
