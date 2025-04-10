import { IsNotEmpty, IsString } from "class-validator";

export class AddFarmWorkersParamsDto {
  @IsNotEmpty()
  @IsString()
  farmId: string;
}
