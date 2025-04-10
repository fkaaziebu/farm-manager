import { IsNotEmpty, IsString } from "class-validator";

export class AddAnimalExpenseRecordParamsDto {
  @IsNotEmpty()
  @IsString()
  tagNumber: string;
}
