import { Field, ID, ObjectType } from "@nestjs/graphql";
import { AnimalType } from "./animal.type";

@ObjectType("HealthRecord")
export class HealthRecordType {
  @Field(() => ID)
  id: number;

  @Field()
  issue: string;

  @Field()
  symptoms: string;

  @Field()
  diagnosis: string;

  @Field()
  medication: string;

  @Field()
  vet_name: string;

  @Field()
  cost: number;

  @Field()
  notes: string;

  @Field(() => AnimalType, { nullable: true })
  animal?: AnimalType;
}
