import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class IntFilterInput {
  @Field(() => Int, { nullable: true })
  eq?: number;

  @Field(() => Int, { nullable: true })
  notEq?: number;

  @Field(() => Int, { nullable: true })
  greaterThan?: number;

  @Field(() => Int, { nullable: true })
  greaterThanOrEqual?: number;

  @Field(() => Int, { nullable: true })
  lessThan?: number;

  @Field(() => Int, { nullable: true })
  lessThanOrEqual?: number;

  @Field(() => [Int], { nullable: true })
  in?: number[];

  @Field(() => Boolean, { nullable: true })
  isNil?: boolean;
}
