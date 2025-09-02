import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @MinLength(6)
  @Matches(/[A-Z]/, { message: 'must contain at least 1 special character' })
  password: string;
}
