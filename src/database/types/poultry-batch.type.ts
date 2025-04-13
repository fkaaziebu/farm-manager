import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { FarmTypeClass } from "./farm.type";
import { ExpenseRecordType } from "./expense-record.type";
import { SalesRecordType } from "./sales-record.type";
import { HealthRecordTypeClass } from "./health-record.type";
import { GrowthRecordTypeClass } from "./growth-record.type";
import { CoopType } from "./coop.type";
// Import the shared enum instead of defining it here
import { BatchHealthStatus } from "./batch-health-status.enum";

export enum PoultryType {
  CHICKEN = "CHICKEN",
  DUCK = "DUCK",
  TURKEY = "TURKEY",
  QUAIL = "QUAIL",
  OTHER = "OTHER",
}

export enum PoultryPurpose {
  MEAT = "MEAT",
  EGGS = "EGGS",
  DUAL_PURPOSE = "DUAL_PURPOSE",
  BREEDING = "BREEDING",
}

// Removed BatchHealthStatus enum as it's now imported from a shared file

registerEnumType(PoultryType, {
  name: "PoultryType",
  description: "Type of poultry",
});

registerEnumType(PoultryPurpose, {
  name: "PoultryPurpose",
  description: "Purpose of raising poultry",
});

// No need to register BatchHealthStatus here as it's registered in batch-health-status.enum.ts

@ObjectType("PoultryBatch")
export class PoultryBatchType {
  @Field(() => ID)
  id: number;

  @Field()
  batch_id: string;

  @Field(() => PoultryType)
  poultry_type: PoultryType;

  @Field()
  breed: string;

  @Field(() => PoultryPurpose)
  purpose: PoultryPurpose;

  @Field()
  hatch_date: Date;

  @Field()
  initial_count: number;

  @Field()
  current_count: number;

  @Field()
  mortality_count: number;

  @Field()
  sold_count: number;

  @Field()
  average_weight: number;

  @Field()
  feed_consumption_kg: number;

  @Field()
  egg_production: number;

  @Field()
  feed_conversion_ratio: number;

  @Field(() => BatchHealthStatus)
  health_status: BatchHealthStatus;

  @Field(() => FarmTypeClass, { nullable: true })
  farm?: FarmTypeClass;

  @Field(() => CoopType, { nullable: true })
  coop?: CoopType;

  @Field(() => [ExpenseRecordType], { nullable: true })
  expense_records?: ExpenseRecordType[];

  @Field(() => [HealthRecordTypeClass], { nullable: true })
  health_records?: HealthRecordTypeClass[];

  @Field(() => [SalesRecordType], { nullable: true })
  sales_records?: SalesRecordType[];

  @Field(() => [GrowthRecordTypeClass], { nullable: true })
  growth_records?: GrowthRecordTypeClass[];

  @Field()
  inserted_at: Date;

  @Field()
  updated_at: Date;
}
