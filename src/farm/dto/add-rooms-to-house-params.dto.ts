import { IsNotEmpty, IsString } from "class-validator";

export class AddRoomsToHouseParamsDto {
  @IsNotEmpty()
  @IsString()
  farmId: string;

  @IsNotEmpty()
  @IsString()
  houseNumber: string;
}
