import {
  IsNotEmpty,
  ValidateNested,
  ArrayMinSize,
  IsString,
} from "class-validator";
import { Type } from "class-transformer";

// DTO for individual worker data
export class RoomDto {
  @IsNotEmpty()
  @IsString()
  room_number: string;
}

export class AddRoomsToHouseBodyDto {
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => RoomDto)
  rooms: RoomDto[];
}
