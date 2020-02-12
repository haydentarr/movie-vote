// Combine with DTO and entity

export class User {
  constructor(
    public uuid: string,
    public email: string,
    public name: string,
    public password: string
  ) {}
}