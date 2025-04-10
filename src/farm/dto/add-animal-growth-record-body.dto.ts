import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { GrowthPeriod } from "src/entities/growth_record.entity";

export class AddAnimalGrowthRecordBodyDto {
  @IsNotEmpty()
  @IsEnum(GrowthPeriod, {
    message: "Period must be one of: BIRTH, 4_WEEKS, 8_WEEKS, ADULTHOOD",
  })
  period: GrowthPeriod;

  @IsNotEmpty()
  @IsNumber()
  growthRate: number;

  @IsString()
  notes?: string;
}
