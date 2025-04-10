import {
  IsNotEmpty,
  ValidateNested,
  ArrayMinSize,
  IsString,
} from "class-validator";
import { Type } from "class-transformer";

// DTO for individual worker data
export class HouseDto {
  @IsNotEmpty()
  @IsString()
  house_number: string;
}

export class AddHousesToFarmBodyDto {
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => HouseDto)
  houses: HouseDto[];
}
