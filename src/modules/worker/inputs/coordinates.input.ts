import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CoordinatesInput {
  @Field()
  lat: number;

  @Field()
  lon: number;
}
