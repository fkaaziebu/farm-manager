import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class DateFilterInput {
  @Field({ nullable: true })
  eq?: Date;

  @Field({ nullable: true })
  notEq?: Date;

  @Field({ nullable: true })
  greaterThan?: Date;

  @Field({ nullable: true })
  greaterThanOrEqual?: Date;

  @Field({ nullable: true })
  lessThan?: Date;

  @Field({ nullable: true })
  lessThanOrEqual?: Date;

  @Field(() => Boolean, { nullable: true })
  isNil?: boolean;
}
