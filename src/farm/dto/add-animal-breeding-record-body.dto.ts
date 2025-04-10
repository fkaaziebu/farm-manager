import { IsDateString, IsNotEmpty, IsString } from "class-validator";

export class AddAnimalBreedingRecordBodyDto {
  @IsNotEmpty()
  @IsDateString()
  matingDate: Date;

  @IsNotEmpty()
  @IsDateString()
  expectedDelivery: Date;

  @IsNotEmpty()
  @IsString()
  maleTagNumber: string;

  @IsNotEmpty()
  @IsString()
  femaleTagNumber: string;
}
