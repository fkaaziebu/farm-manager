import { IsNumber, IsString } from "class-validator";

export class AddAnimalHealthRecordBodyDto {
  @IsString()
  issue: string;

  @IsString()
  symptoms: string;

  @IsString()
  diagnosis: string;

  @IsString()
  medication: string;

  @IsString()
  vet_name: string;

  @IsNumber()
  cost: number;

  @IsString()
  notes?: string;
}
