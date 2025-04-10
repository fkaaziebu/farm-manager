import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class BooleanFilterInput {
  @Field({ nullable: true })
  eq?: boolean;

  @Field(() => Boolean, { nullable: true })
  isNil?: boolean;
}
