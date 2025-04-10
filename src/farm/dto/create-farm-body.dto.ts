import { IsNotEmpty, IsString } from "class-validator";

export class CreateFarmBodyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsString()
  area: string;
}
