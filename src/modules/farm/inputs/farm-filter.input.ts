import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class FarmFilterInput {
  @Field(() => Int, { nullable: true })
  id?: number;
}
