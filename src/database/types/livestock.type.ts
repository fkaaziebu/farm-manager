import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { FarmTypeClass } from "./farm.type";
import { BreedingRecordType } from "./breeding-record.type";
import { GrowthRecordType, GrowthRecordTypeClass } from "./growth-record.type";
import { ExpenseRecordType } from "./expense-record.type";
import { HealthRecordType, HealthRecordTypeClass } from "./health-record.type";
import { PenType } from "./pen.type";

export enum LivestockType {
  CATTLE = "CATTLE",
  GOAT = "GOAT",
  SHEEP = "SHEEP",
  PIG = "PIG",
  OTHER = "OTHER",
}

export enum HealthStatus {
  HEALTHY = "HEALTHY",
  SICK = "SICK",
  TREATED = "TREATED",
  RECOVERING = "RECOVERING",
  CRITICAL = "CRITICAL",
}

export enum LivestockGender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

registerEnumType(LivestockType, {
  name: "LivestockType",
  description: "Type of livestock animal",
});

registerEnumType(HealthStatus, {
  name: "HealthStatus",
  description: "Health status of an animal",
});

registerEnumType(LivestockGender, {
  name: "LivestockGender",
  description: "Gender of an animal",
});

@ObjectType("Livestock")
export class LivestockTypeClass {
  @Field(() => ID)
  id: number;

  @Field()
  livestock_tag: string;

  @Field(() => LivestockType)
  livestock_type: LivestockType;

  @Field()
  breed: string;

  @Field(() => LivestockGender)
  gender: LivestockGender;

  @Field()
  birth_date: Date;

  @Field()
  weight: number;

  @Field({ nullable: true })
  milk_production?: number;

  @Field({ nullable: true })
  meat_grade?: string;

  @Field(() => HealthStatus)
  health_status: HealthStatus;

  @Field()
  available: boolean;

  @Field(() => LivestockTypeClass, { nullable: true })
  mother?: LivestockTypeClass;

  @Field(() => LivestockTypeClass, { nullable: true })
  father?: LivestockTypeClass;

  @Field(() => [LivestockTypeClass], { nullable: true })
  offspring?: LivestockTypeClass[];

  @Field(() => FarmTypeClass, { nullable: true })
  farm?: FarmTypeClass;

  @Field(() => PenType, { nullable: true })
  pen?: PenType;

  @Field(() => [BreedingRecordType], { nullable: true })
  breeding_records?: BreedingRecordType[];

  @Field(() => [GrowthRecordTypeClass], { nullable: true })
  growth_records?: GrowthRecordTypeClass[];

  @Field(() => [ExpenseRecordType], { nullable: true })
  expense_records?: ExpenseRecordType[];

  @Field(() => [HealthRecordTypeClass], { nullable: true })
  health_records?: HealthRecordTypeClass[];

  @Field()
  inserted_at: Date;

  @Field()
  updated_at: Date;
}
