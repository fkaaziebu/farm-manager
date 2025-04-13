import { IsUUID } from 'class-validator';

export class PasswordResetQueryDto {
  @IsUUID()
  resetCode: string;
}
