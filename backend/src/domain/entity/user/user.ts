export class User {
  private id: string
  private name: string
  private mailAddress: string
  private status: string

  static active = '在籍中'

  public constructor(props: {
    id: string
    name: string
    mailAddress: string
    status: string
  }) {
    const { id, name, mailAddress, status } = props

    this.id = id
    this.name = name
    this.mailAddress = mailAddress
    this.status = status
  }

  public changeStatus(status: string): User {
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
