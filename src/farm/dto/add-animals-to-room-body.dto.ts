import {
  IsNotEmpty,
  ValidateNested,
  ArrayMinSize,
  IsString,
  IsEnum,
  IsDateString,
} from "class-validator";
import { Type } from "class-transformer";

// Gender type
enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

// DTO for individual animal data
export class AnimalDto {
  @IsNotEmpty()
  @IsString()
  tag_number: string;

  @IsNotEmpty()
  @IsEnum(Gender, {
    message: "Gender must be one of: MALE, FEMALE",
  })
  gender: Gender;

  @IsNotEmpty()
  @IsDateString()
  birth_date: Date;

  @IsNotEmpty()
  @IsString()
  breed: string;
}

export class AddAnimalsToRoomBodyDto {
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => AnimalDto)
  animals: AnimalDto[];
}
