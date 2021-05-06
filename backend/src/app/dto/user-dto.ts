import { UserStatus } from 'src/domain/valueOblect/user-status'

export class UserDTO {
  public readonly id: string
  public readonly name: string
  public readonly mailAddress: string
  public readonly status: UserStatus
  public constructor(props: {
    id: string
    name: string
    mailAddress: string
    status: UserStatus
  }) {
    const { id, name, mailAddress, status } = props
    this.id = id
    this.name = name
    this.mailAddress = mailAddress
    this.status = status
  }
}
