// @see https://docs.nestjs.com/openapi/types-and-parameters

import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class CreateTaskGroupRequest {
  @ApiProperty()
  @IsNotEmpty()
  readonly name!: string

  @ApiProperty()
  @IsNotEmpty()
  readonly taskIds!: string[]
}

export class updateNameRequest {
  @ApiProperty()
  @IsNotEmpty()
  readonly taskGroupId!: string

  @ApiProperty()
  @IsNotEmpty()
  readonly name!: string
}
