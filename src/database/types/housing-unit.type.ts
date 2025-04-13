import { Field, ID, ObjectType, InterfaceType } from "@nestjs/graphql";
import { FarmTypeClass } from "./farm.type";
import { ExpenseRecordType } from "./expense-record.type";
import { HousingStatus } from "./housing-status.enum";

@InterfaceType()
export abstract class HousingUnitInterface {
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
}

// Changed to export default to avoid issues with class extension
@ObjectType("HousingUnit", { implements: () => [HousingUnitInterface] })
export class HousingUnitType implements HousingUnitInterface {
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

  @Field(() => FarmTypeClass, { nullable: true })
  farm?: FarmTypeClass;

  @Field(() => [ExpenseRecordType], { nullable: true })
  expense_records?: ExpenseRecordType[];
}
