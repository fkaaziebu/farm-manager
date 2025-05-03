import { Field, InputType } from "@nestjs/graphql";
import GraphQLJSON from "graphql-type-json";
import { BreedingStatus } from "../../../database/types/breeding-record.type";

@InputType()
export class UpdateBreedingRecordInput {
  @Field({ nullable: true })
  matingDate?: Date;

  @Field({ nullable: true })
  cost?: number;

  @Field({ nullable: true })
  expectedDelivery?: Date;

  @Field({ nullable: true })
  actualDelivery?: Date;

  @Field(() => GraphQLJSON, { nullable: true })
  breedingMethod?: any;

  @Field({ nullable: true })
  notes?: string;

  @Field({ nullable: true })
  offspringCountMale?: number;

  @Field({ nullable: true })
  offspringCountFemale?: number;

  @Field(() => BreedingStatus, { nullable: true })
  status?: BreedingStatus;
}
