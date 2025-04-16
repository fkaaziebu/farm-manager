import { Field, ID, ObjectType } from "@nestjs/graphql";
import { PenType } from "./pen.type";
import { FarmTypeClass } from "./farm.type";
import { ExpenseRecordType } from "./expense-record.type";
import { HousingStatus } from "./housing-status.enum";
import { TaskType } from "./task.type";

@ObjectType("Barn")
export class BarnType {
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
  building_material?: string;

  @Field({ nullable: true })
  ventilation_type?: string;

  @Field()
  climate_controlled: boolean;

  @Field(() => [PenType], { nullable: true })
  pens?: PenType[];

  // Fields from HousingUnitType that we need
  @Field(() => FarmTypeClass, { nullable: true })
  farm?: FarmTypeClass;

  @Field(() => [ExpenseRecordType], { nullable: true })
  expense_records?: ExpenseRecordType[];

  @Field(() => [TaskType], { nullable: true })
  tasks?: TaskType[];
}
