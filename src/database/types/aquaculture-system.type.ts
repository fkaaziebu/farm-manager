import { Field, ObjectType, registerEnumType, ID } from "@nestjs/graphql";
import { PondType } from "./pond.type";
import { FarmTypeClass } from "./farm.type";
import { ExpenseRecordType } from "./expense-record.type";
import { HousingStatus } from "./housing-status.enum";

export enum AquacultureSystemType {
  POND = "POND",
  RACEWAY = "RACEWAY",
  RAS = "RAS",
  CAGE = "CAGE",
  BIOFLOC = "BIOFLOC",
  AQUAPONICS = "AQUAPONICS",
}

registerEnumType(AquacultureSystemType, {
  name: "AquacultureSystemType",
  description: "Type of aquaculture system",
});

// Changed to implement the interface directly instead of extending the class
@ObjectType("AquacultureSystem")
export class AquacultureSystemTypeClass {
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

  @Field(() => AquacultureSystemType)
  system_type: AquacultureSystemType;

  @Field()
  total_water_volume: number;

  @Field({ nullable: true })
  filtration_method?: string;

  @Field({ nullable: true })
  aeration_method?: string;

  @Field({ nullable: true })
  water_source?: string;

  @Field(() => [PondType], { nullable: true })
  ponds?: PondType[];

  // Fields from HousingUnitType that we need
  @Field(() => FarmTypeClass, { nullable: true })
  farm?: FarmTypeClass;

  @Field(() => [ExpenseRecordType], { nullable: true })
  expense_records?: ExpenseRecordType[];
}
