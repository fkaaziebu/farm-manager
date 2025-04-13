import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { FarmTypeClass } from "./farm.type";
import { ExpenseRecordType } from "./expense-record.type";
import { SalesRecordType } from "./sales-record.type";
import { ApiaryType } from "./apiary.type";

export enum HiveStatus {
  ACTIVE = "ACTIVE",
  WEAK = "WEAK",
  STRONG = "STRONG",
  COLLAPSED = "COLLAPSED",
  SWARMING = "SWARMING",
}

registerEnumType(HiveStatus, {
  name: "HiveStatus",
  description: "Status of a beehive",
});

@ObjectType("Hive")
export class HiveType {
  @Field(() => ID)
  id: number;

  @Field()
  hive_id: string;

  @Field()
  queen_age: number;

  @Field()
  honey_production: number;

  @Field()
  wax_production: number;

  @Field()
  pollen_collection: number;

  @Field(() => HiveStatus)
  status: HiveStatus;

  @Field()
  bee_population: number;

  @Field({ nullable: true })
  last_inspection?: Date;

  @Field(() => FarmTypeClass, { nullable: true })
  farm?: FarmTypeClass;

  @Field(() => ApiaryType, { nullable: true })
  apiary?: ApiaryType;

  @Field(() => [ExpenseRecordType], { nullable: true })
  expense_records?: ExpenseRecordType[];

  @Field(() => SalesRecordType, { nullable: true })
  sales_record?: SalesRecordType;

  @Field()
  inserted_at: Date;

  @Field()
  updated_at: Date;
}
