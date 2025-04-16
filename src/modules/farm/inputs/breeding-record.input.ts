import { Field, InputType } from "@nestjs/graphql";
import GraphQLJSON from "graphql-type-json";
import { BreedingStatus } from "../../../database/types/breeding-record.type";

@InputType()
export class BreedingRecordInput {
  @Field()
  matingDate: Date;

  @Field()
  expectedDelivery: Date;

  @Field(() => GraphQLJSON, { nullable: true })
  breedingMethod?: any;

  @Field({ nullable: true })
  notes?: string;

  @Field(() => BreedingStatus, { nullable: false })
  status: BreedingStatus;
}
