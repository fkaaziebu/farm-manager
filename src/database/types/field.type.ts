import { Field, ID, ObjectType } from "@nestjs/graphql";
import { CropBatchType } from "./crop-batch.type";
import { GraphQLJSON } from "graphql-type-json";
import { FarmTypeClass } from "./farm.type";
import { ExpenseRecordType } from "./expense-record.type";
import { CropHousingStatus } from "./housing-status.enum";

@ObjectType("Field")
export class FieldType {
  @Field(() => ID)
  id: number;

  @Field()
  unit_id: string;

  @Field()
  name: string;

  @Field()
  capacity: number;

  @Field(() => CropHousingStatus)
  status: CropHousingStatus;

  @Field()
  area_hectares: number;

  @Field({ nullable: true })
  soil_type?: string;

  @Field({ nullable: true })
  irrigation_type?: string;

  @Field({ nullable: true })
  slope?: string;

  @Field({ nullable: true })
  drainage?: string;

  @Field(() => GraphQLJSON, { nullable: true })
  soil_test_results?: any;

  @Field({ nullable: true })
  previous_crop?: string;

  @Field(() => [CropBatchType], { nullable: true })
  crop_batches?: CropBatchType[];

  // Fields from HousingUnitType that we need
  @Field(() => FarmTypeClass, { nullable: true })
  farm?: FarmTypeClass;

  @Field(() => [ExpenseRecordType], { nullable: true })
  expense_records?: ExpenseRecordType[];
}
