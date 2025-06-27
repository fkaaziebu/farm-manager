import { Field, InputType } from "@nestjs/graphql";
import GraphQLJSON from "graphql-type-json";
import { BreedingStatus } from "../../../database/types/breeding-record.type";
import { LivestockGender } from "src/database/types";

@InputType()
class Offspring {
  @Field()
  livestockTag: string;

  @Field()
  breed: string;

  @Field()
  weight: number;

  @Field(() => LivestockGender, { nullable: false })
  gender: LivestockGender;
}

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

  @Field(() => [Offspring], { nullable: true })
  offsprings?: Offspring[];

  @Field(() => BreedingStatus, { nullable: true })
  status?: BreedingStatus;
}
