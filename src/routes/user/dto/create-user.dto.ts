import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator'

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string

  @MinLength(2)
  @MaxLength(10)
  @IsNotEmpty()
  name: string

  @MinLength(8)
  @IsNotEmpty()
  password: string
}
