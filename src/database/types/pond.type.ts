import { Field, ID, ObjectType } from "@nestjs/graphql";
import { AquacultureSystemTypeClass } from "./aquaculture-system.type";
import { AquacultureBatchType } from "./aquaculture-batch.type";
import { FarmTypeClass } from "./farm.type";
import { ExpenseRecordType } from "./expense-record.type";

@ObjectType("Pond")
export class PondType {
  @Field(() => ID)
  id: number;

  @Field()
  unit_id: string;

  @Field()
  name: string;

  @Field()
  capacity: number;

  @Field(() => HousingStatus)
  status: HousingStatus;

  @Field()
  volume_liters: number;

  @Field()
  depth_meters: number;

  @Field()
  surface_area_sqm: number;

  @Field({ nullable: true })
  liner_type?: string;

  @Field({ nullable: true })
  water_source?: string;

  @Field(() => GraphQLJSON, { nullable: true })
  water_parameters?: any;

  @Field(() => AquacultureSystemTypeClass, { nullable: true })
  aquacultureSystem?: AquacultureSystemTypeClass;

  @Field(() => [AquacultureBatchType], { nullable: true })
  aquaculture_batches?: AquacultureBatchType[];

  // Fields from HousingUnitType that we need
  @Field(() => FarmTypeClass, { nullable: true })
  farm?: FarmTypeClass;

  @Field(() => [ExpenseRecordType], { nullable: true })
  expense_records?: ExpenseRecordType[];
}

// Import the GraphQLJSON type for the water_parameters field
import { GraphQLJSON } from "graphql-type-json";
import { HousingStatus } from "./housing-status.enum";
