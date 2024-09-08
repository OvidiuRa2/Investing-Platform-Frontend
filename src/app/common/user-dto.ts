export class UserDto {
  constructor(
    public name: string,
    public email: string,
    public password: string,
    public phoneNumber: string,
    public imageUrl: string
  ) {}
}
