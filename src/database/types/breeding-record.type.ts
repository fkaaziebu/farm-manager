import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { LivestockTypeClass } from "./livestock.type";
import { GraphQLJSON } from "graphql-type-json";

export enum BreedingStatus {
  PLANNED = "PLANNED",
  IN_PROGRESS = "IN_PROGRESS",
  SUCCESSFUL = "SUCCESSFUL",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

registerEnumType(BreedingStatus, {
  name: "BreedingStatus",
  description: "Status of a breeding record",
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
  litter_size?: number;

  @Field({ nullable: true })
  offspring_count_male?: number;

  @Field({ nullable: true })
  offspring_count_female?: number;

  @Field({ nullable: true })
  notes?: string;

  @Field(() => BreedingStatus)
  status: BreedingStatus;

  @Field(() => GraphQLJSON, { nullable: true })
  breeding_method?: any;

  @Field(() => [LivestockTypeClass], { nullable: true })
  animals?: LivestockTypeClass[];

  @Field()
  inserted_at: Date;

  @Field()
  updated_at: Date;
}
