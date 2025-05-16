import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class ReviewInput {
  @Field()
  description: string;

  @Field()
  rating: number;
}
