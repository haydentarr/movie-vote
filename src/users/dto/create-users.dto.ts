import { IsString, IsNotEmpty, IsEmail, Length } from 'class-validator';

export class CreateUserDTO {

  @IsNotEmpty()
  @IsString() 
  @Length(1, 100) public name: string;

  @IsNotEmpty()
  @IsEmail() 
  @Length(3, 254) public email: string;
  
  @IsNotEmpty()
  @IsString() 
  @Length(6, 50) public password: string;
}