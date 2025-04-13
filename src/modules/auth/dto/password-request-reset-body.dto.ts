import { IsEmail, IsNotEmpty } from 'class-validator';

export class PasswordRequestResetBodyDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
