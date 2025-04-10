import {
  IsEmail,
  IsNotEmpty,
  IsString,
  ValidateNested,
  ArrayMinSize,
} from "class-validator";
import { Type } from "class-transformer";

// DTO for individual worker data
export class WorkerDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  email: string;
}

// Main DTO for creating multiple workers
export class CreateWorkersBodyDto {
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => WorkerDto)
  workers: WorkerDto[];
}
