import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from "class-validator";
import { ExpenseCategory } from "src/entities/expense_record.entity";

export class AddAnimalExpenseRecordBodyDto {
  @IsNotEmpty()
  @IsEnum(ExpenseCategory, {
    message:
      "Category must be one of: FEED, MEDICAL, VACCINATION, BREEDING, IDENTIFICATION, GROOMING, SUPPLEMENTS, TESTING, QUARANTINE, TRANSPORT, SPECIAL_HOUSING, OTHER",
  })
  category: ExpenseCategory;

  @IsNotEmpty()
  @IsDateString()
  expenseDate: Date;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsString()
  notes?: string;
}
