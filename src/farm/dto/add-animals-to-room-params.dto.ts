import { IsNotEmpty, IsString } from "class-validator";

export class AddAnimalsToRoomParamsDto {
  @IsNotEmpty()
  @IsString()
  farmId: string;

  @IsNotEmpty()
  @IsString()
  houseNumber: string;

  @IsNotEmpty()
  @IsString()
  roomNumber: string;
}
