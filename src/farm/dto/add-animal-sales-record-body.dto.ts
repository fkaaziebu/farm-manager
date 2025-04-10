import { IsDateString, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class AddAnimalSalesRecordBodyDto {
  @IsNotEmpty()
  @IsString()
  buyerName: string;

  @IsNotEmpty()
  @IsDateString()
  saleDate: Date;

  @IsNotEmpty()
  @IsNumber()
  priceSold: number;

  @IsString()
  notes?: string;
}
