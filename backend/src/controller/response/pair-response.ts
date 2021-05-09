import { ApiProperty } from '@nestjs/swagger'
import { PairDTO } from 'src/app/dto/pair-dto'
import { PairUser } from 'src/domain/entity/pair/pair'

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
  pairUsers: PairUser[]

  public constructor(params: {
    id: string
    name: string
    pairUsers: PairUser[]
  }) {
    this.id = params.id
    this.name = params.name
    this.pairUsers = params.pairUsers
  }
}
