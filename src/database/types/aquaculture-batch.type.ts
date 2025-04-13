import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { FarmTypeClass } from "./farm.type";
import { ExpenseRecordType } from "./expense-record.type";
import { SalesRecordType } from "./sales-record.type";
import { HealthRecordTypeClass } from "./health-record.type";
import { GrowthRecordTypeClass } from "./growth-record.type";
import { PondType } from "./pond.type";
import { GraphQLJSON } from "graphql-type-json";
// Import the shared enum
import { BatchHealthStatus } from "./batch-health-status.enum";

export enum AquaticType {
  FISH = "FISH",
  SHRIMP = "SHRIMP",
  CRAB = "CRAB",
  OYSTER = "OYSTER",
  OTHER = "OTHER",
}

export enum WaterType {
  FRESHWATER = "FRESHWATER",
  SALTWATER = "SALTWATER",
  BRACKISH = "BRACKISH",
}

registerEnumType(AquaticType, {
  name: "AquaticType",
  description: "Type of aquatic animal",
});

registerEnumType(WaterType, {
  name: "WaterType",
  description: "Type of water environment",
});

@ObjectType("AquacultureBatch")
export class AquacultureBatchType {
  @Field(() => ID)
  id: number;

  @Field()
  batch_id: string;

  @Field(() => AquaticType)
  aquatic_type: AquaticType;

  @Field()
  species: string;

  @Field(() => WaterType)
  water_type: WaterType;

  @Field()
  stocking_date: Date;

  @Field()
  initial_count: number;

  @Field()
  current_count: number;

  @Field()
  mortality_count: number;

  @Field()
  harvested_count: number;

  @Field()
  average_weight: number;

  @Field()
  feed_consumption_kg: number;

  @Field()
  feed_conversion_ratio: number;

  @Field(() => GraphQLJSON, { nullable: true })
  water_parameters?: any;

  @Field()
  stocking_density: number;

  @Field(() => BatchHealthStatus)
  health_status: BatchHealthStatus;

  @Field(() => FarmTypeClass, { nullable: true })
  farm?: FarmTypeClass;

  @Field(() => PondType, { nullable: true })
  pond?: PondType;

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
