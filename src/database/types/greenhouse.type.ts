import { Field, ID, ObjectType } from "@nestjs/graphql";
import { CropBatchType } from "./crop-batch.type";
import { FarmTypeClass } from "./farm.type";
import { ExpenseRecordType } from "./expense-record.type";
import { HousingStatus } from "./housing-status.enum";

@ObjectType("Greenhouse")
export class GreenhouseType {
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
  area_sqm: number;

  @Field({ nullable: true })
  construction_date?: Date;

  @Field({ nullable: true })
  covering_material?: string;

  @Field({ nullable: true })
  temperature_control?: string;

  @Field({ nullable: true })
  lighting_system?: string;

  @Field({ nullable: true })
  irrigation_system?: string;

  @Field()
  climate_controlled: boolean;

  @Field({ nullable: true })
  ventilation_system?: string;

  @Field(() => [CropBatchType], { nullable: true })
  crop_batches?: CropBatchType[];

  // Fields from HousingUnitType that we need
  @Field(() => FarmTypeClass, { nullable: true })
  farm?: FarmTypeClass;

  @Field(() => [ExpenseRecordType], { nullable: true })
  expense_records?: ExpenseRecordType[];
}
