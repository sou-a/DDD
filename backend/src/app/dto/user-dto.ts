export class UserDTO {
  public readonly id: string
  public readonly name: string
  public readonly mailAddress: string
  public readonly status: string
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
}
