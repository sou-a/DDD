import { UserStatus } from './user-status'

export class User {
  private id: string
  private name: string
  private mailAddress: string
  private status: UserStatus

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

  public changeStatus(status: UserStatus): User {
    this.status = status
    return this
  }

  public getAllProperties() {
    return {
      id: this.id,
      name: this.name,
      mailAddress: this.mailAddress,
      status: this.status,
    }
  }
}
