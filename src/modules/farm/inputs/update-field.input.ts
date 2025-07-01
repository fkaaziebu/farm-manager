import { Field, InputType } from "@nestjs/graphql";
import GraphQLJSON from "graphql-type-json";
import { HousingStatus } from "src/database/types/housing-status.enum";

@InputType()
export class UpdateFieldInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  capacity?: number;

  @Field({ nullable: true })
  areaHectares?: number;

  @Field({ nullable: true })
  soilType?: string;

  @Field({ nullable: true })
  irrigationType?: string;

  @Field({ nullable: true })
  slope?: string;

  @Field({ nullable: true })
  drainage?: string;

  @Field({ nullable: true })
  previousCrop?: string;

  @Field(() => HousingStatus, { nullable: true })
  status?: HousingStatus;

  @Field(() => GraphQLJSON, { nullable: true })
  soilTestResults?: any;

  @Field(() => GraphQLJSON, { nullable: true })
  gpsCoordinates?: any;
}
