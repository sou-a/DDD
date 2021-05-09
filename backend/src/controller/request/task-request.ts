// @see https://docs.nestjs.com/openapi/types-and-parameters

import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class CreateTaskRequest {
  @ApiProperty()
  @IsNotEmpty()
  readonly name!: string

  @ApiProperty()
  @IsNotEmpty()
  readonly taskGroupId!: string
}

export class UpdateTaskStatusRequest {
  @ApiProperty()
  @IsNotEmpty()
  readonly taskId!: string

  @ApiProperty()
  @IsNotEmpty()
  readonly userId!: string

  @ApiProperty()
  @IsNotEmpty()
  readonly status!: string
}

export class UpdateTaskGroupRequest {
  @ApiProperty()
  @IsNotEmpty()
  readonly taskId!: string

  @ApiProperty()
  @IsNotEmpty()
  readonly taskGroupId!: string
}
