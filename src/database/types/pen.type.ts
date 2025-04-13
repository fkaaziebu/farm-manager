import { Field, ID, ObjectType } from "@nestjs/graphql";
import { BarnType } from "./barn.type";
import { LivestockTypeClass } from "./livestock.type";
import { FarmTypeClass } from "./farm.type";
import { ExpenseRecordType } from "./expense-record.type";
import { HousingStatus } from "./housing-status.enum";

@ObjectType("Pen")
export class PenType {
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

  @Field({ nullable: true })
  bedding_type?: string;

  @Field()
  area_sqm: number;

  @Field({ nullable: true })
  feeder_type?: string;

  @Field({ nullable: true })
  waterer_type?: string;

  @Field(() => BarnType, { nullable: true })
  barn?: BarnType;

  @Field(() => [LivestockTypeClass], { nullable: true })
  livestock?: LivestockTypeClass[];

  // Fields from HousingUnitType that we need
  @Field(() => FarmTypeClass, { nullable: true })
  farm?: FarmTypeClass;

  @Field(() => [ExpenseRecordType], { nullable: true })
  expense_records?: ExpenseRecordType[];
}
