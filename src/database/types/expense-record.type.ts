import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { LivestockTypeClass } from "./livestock.type";
import { PoultryBatchType } from "./poultry-batch.type";
import { AquacultureBatchType } from "./aquaculture-batch.type";
import { CropBatchType } from "./crop-batch.type";
import { HiveType } from "./hive.type";
import { HousingUnitType } from "./housing-unit.type";

export enum ExpenseCategory {
  // General categories
  FEED = "FEED",
  MEDICAL = "MEDICAL",
  VACCINATION = "VACCINATION",
  SUPPLEMENTS = "SUPPLEMENTS",
  TESTING = "TESTING",
  TRANSPORT = "TRANSPORT",
  EQUIPMENT = "EQUIPMENT",
  MAINTENANCE = "MAINTENANCE",
  UTILITIES = "UTILITIES",
  LABOR = "LABOR",

  // Livestock specific
  BREEDING = "BREEDING",
  IDENTIFICATION = "IDENTIFICATION",
  GROOMING = "GROOMING",

  // Crop specific
  FERTILIZER = "FERTILIZER",
  PESTICIDE = "PESTICIDE",
  HERBICIDE = "HERBICIDE",
  SEEDS = "SEEDS",
  IRRIGATION = "IRRIGATION",
  HARVESTING = "HARVESTING",

  // Housing related
  HOUSING = "HOUSING",
  BEDDING = "BEDDING",
  CLEANING = "CLEANING",

  // Other
  OTHER = "OTHER",
}

registerEnumType(ExpenseCategory, {
  name: "ExpenseCategory",
  description: "Category of farm expense",
});

@ObjectType("ExpenseRecord")
export class ExpenseRecordType {
  @Field(() => ID)
  id: number;

  @Field(() => ExpenseCategory)
  category: ExpenseCategory;

  @Field()
  expense_date: Date;

  @Field()
  amount: number;

  @Field()
  notes: string;

  @Field(() => LivestockTypeClass, { nullable: true })
  livestock?: LivestockTypeClass;

  @Field(() => PoultryBatchType, { nullable: true })
  poultry_batch?: PoultryBatchType;

  @Field(() => AquacultureBatchType, { nullable: true })
  aquaculture_batch?: AquacultureBatchType;

  @Field(() => CropBatchType, { nullable: true })
  crop_batch?: CropBatchType;

  @Field(() => HiveType, { nullable: true })
  hive?: HiveType;

  @Field(() => HousingUnitType, { nullable: true })
  housing_unit?: HousingUnitType;
}
