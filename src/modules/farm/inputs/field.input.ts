import { Field, InputType } from "@nestjs/graphql";
import GraphQLJSON from "graphql-type-json";

@InputType()
export class FieldInput {
  @Field()
  unitId: string;

  @Field()
  name: string;

  @Field()
  capacity: number;

  @Field()
  areaHectares: number;

  @Field({ nullable: true })
  soilType?: string;

  @Field({ nullable: true })
  irrigationType?: string;

  @Field({ nullable: true })
  slope?: string;

  @Field({ nullable: true })
  drainage?: string;

  @Field(() => GraphQLJSON, { nullable: true })
  soilTestResults?: any;
}
