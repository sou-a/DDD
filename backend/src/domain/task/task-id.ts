import { isEmpty } from 'class-validator'
import ValueObject from '../shared/value-object'

export class TaskId extends ValueObject<string, 'TaskId'> {
  public constructor(value: string) {
    super(value)
    if (isEmpty(value)) {
      throw new Error('user id must be not empty')
    }
  }
}
