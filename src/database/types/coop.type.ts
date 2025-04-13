import { Field, ID, ObjectType } from "@nestjs/graphql";
import { PoultryHouseType } from "./poultry-house.type";
import { PoultryBatchType } from "./poultry-batch.type";
import { FarmTypeClass } from "./farm.type";
import { ExpenseRecordType } from "./expense-record.type";
import { HousingStatus } from "./housing-status.enum";

@ObjectType("Coop")
export class CoopType {
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
  nest_boxes: number;

  @Field()
  area_sqm: number;

  @Field({ nullable: true })
  floor_type?: string;

  @Field({ nullable: true })
  feeder_type?: string;

  @Field({ nullable: true })
  waterer_type?: string;

  @Field(() => PoultryHouseType, { nullable: true })
  poultryHouse?: PoultryHouseType;

  @Field(() => [PoultryBatchType], { nullable: true })
  poultry_batches?: PoultryBatchType[];

  // Fields from HousingUnitType that we need
  @Field(() => FarmTypeClass, { nullable: true })
  farm?: FarmTypeClass;

  @Field(() => [ExpenseRecordType], { nullable: true })
  expense_records?: ExpenseRecordType[];
}
