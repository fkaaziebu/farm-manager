import { Field, ID, ObjectType } from "@nestjs/graphql";
import { CoopType } from "./coop.type";
import { FarmTypeClass } from "./farm.type";
import { ExpenseRecordType } from "./expense-record.type";
import { HousingStatus } from "./housing-status.enum";

@ObjectType("PoultryHouse")
export class PoultryHouseType {
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
  ventilation_type?: string;

  @Field()
  climate_controlled: boolean;

  @Field({ nullable: true })
  lighting_program?: string;

  @Field({ nullable: true })
  construction_date?: Date;

  @Field(() => [CoopType], { nullable: true })
  coops?: CoopType[];

  // Fields from HousingUnitType that we need
  @Field(() => FarmTypeClass, { nullable: true })
  farm?: FarmTypeClass;

  @Field(() => [ExpenseRecordType], { nullable: true })
  expense_records?: ExpenseRecordType[];
}
