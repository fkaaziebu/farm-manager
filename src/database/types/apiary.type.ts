import { Field, ID, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from "graphql-type-json";
import { HiveType } from "./hive.type";
import { HousingStatus } from "./housing-status.enum";

@ObjectType("Apiary")
export class ApiaryType {
  @Field(() => ID)
  id: number;

  @Field()
  unit_id: string;

  @Field()
  name: string;

  @Field()
  capacity: number;

  @Field(() => HousingStatus)
  status: HousingStatus;

  @Field()
  area_sqm: number;

  @Field({ nullable: true })
  location_features?: string;

  @Field({ nullable: true })
  sun_exposure?: string;

  @Field({ nullable: true })
  wind_protection?: string;

  @Field(() => GraphQLJSON, { nullable: true })
  nearby_flora?: any;

  @Field({ nullable: true })
  water_source?: string;

  @Field(() => GraphQLJSON, { nullable: true })
  gps_coordinates?: any;

  @Field(() => [HiveType], { nullable: true })
  hives?: HiveType[];
}
