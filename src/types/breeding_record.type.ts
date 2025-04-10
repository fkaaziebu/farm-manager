import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { AnimalType } from "./animal.type";

enum BreedingStatus {
  IN_PROGRESS = "IN_PROGRESS",
  SUCCESSFUL = "SUCCESSFUL",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

registerEnumType(BreedingStatus, {
  name: "BreedingStatus",
});

@ObjectType("BreedingRecord")
export class BreedingRecordType {
  @Field(() => ID)
  id: number;

  @Field()
  mating_date: Date;

  @Field()
  expected_delivery: Date;

  @Field({ nullable: true })
  actual_delivery?: Date;

  @Field({ nullable: true })
  liter_size?: number;

  @Field({ nullable: true })
  notes?: string;

  @Field(() => BreedingStatus)
  status: BreedingStatus;

  @Field(() => [AnimalType], { nullable: true })
  animals?: AnimalType[];
}
