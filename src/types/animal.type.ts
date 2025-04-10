import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { FarmType } from "./farm.type";
import { RoomType } from "./room.type";
import { BreedingRecordType } from "./breeding_record.type";
import { GrowthRecordType } from "./growth_record.type";
import { ExpenseRecordType } from "./expense_record.type";
import { HealthRecordType } from "./health_record.type";
import { SalesRecordType } from "./sales_record.type";
import { FarmAnimalType, HealthStatus } from "src/entities/animal.entity";

registerEnumType(HealthStatus, {
  name: "HealthStatus",
});

registerEnumType(FarmAnimalType, {
  name: "FarmAnimalType",
});

@ObjectType("Animal")
export class AnimalType {
  @Field(() => ID)
  id: number;

  @Field()
  tag_number: string;

  @Field()
  gender: string;

  @Field()
  birth_date: Date;

  @Field(() => FarmAnimalType)
  type: FarmAnimalType;

  @Field()
  breed: string;

  @Field()
  weight: number;

  @Field(() => HealthStatus)
  health_status: HealthStatus;

  @Field()
  available: boolean;

  @Field(() => [AnimalType], { nullable: true })
  direct_parents?: AnimalType[];

  @Field(() => [AnimalType], { nullable: true })
  direct_children?: AnimalType[];

  @Field(() => FarmType, { nullable: true })
  farm?: FarmType;

  @Field(() => RoomType, { nullable: true })
  room?: RoomType;

  @Field(() => [BreedingRecordType], { nullable: true })
  breeding_records?: BreedingRecordType[];

  @Field(() => [GrowthRecordType], { nullable: true })
  growth_records?: GrowthRecordType[];

  @Field(() => [ExpenseRecordType], { nullable: true })
  expense_records?: ExpenseRecordType[];

  @Field(() => [HealthRecordType], { nullable: true })
  health_records?: HealthRecordType[];

  @Field(() => SalesRecordType, { nullable: true })
  sales_record?: SalesRecordType;

  @Field()
  inserted_at: Date;

  @Field()
  updated_at: Date;
}
