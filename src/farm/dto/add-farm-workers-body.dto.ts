import {
  IsNotEmpty,
  ValidateNested,
  ArrayMinSize,
  IsNumber,
} from "class-validator";
import { Type } from "class-transformer";

// DTO for individual worker data
export class WorkerDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}

export class AddFarmWorkersBodyDto {
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => WorkerDto)
  workerIds: WorkerDto[];
}
