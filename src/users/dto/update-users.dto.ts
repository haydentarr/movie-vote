import { IsString, IsOptional, IsEmail, Length } from 'class-validator';

export class UpdateUserDTO {

  @IsOptional()
  @IsString() 
  @Length(1, 100) public name?: string;

  @IsOptional()
  @IsEmail() 
  @Length(3, 254) public email?: string;
  
  @IsOptional()
  @IsString() 
  @Length(6, 50) public password?: string;
}