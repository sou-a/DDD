// @see https://docs.nestjs.com/openapi/types-and-parameters

import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class CreateUserRequest {
  @ApiProperty()
  @IsNotEmpty()
  readonly name!: string

  @ApiProperty()
  @IsNotEmpty()
  readonly mailAddress!: string

  @ApiProperty()
  @IsNotEmpty()
  readonly status!: string
}

export class UpdateUserStatusRequest {
  @ApiProperty()
  @IsNotEmpty()
  readonly status!: string
}
