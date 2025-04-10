import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class StringFilterInput {
  @Field({ nullable: true })
  eq?: string;

  @Field({ nullable: true })
  notEq?: string;

  @Field({ nullable: true })
  contains?: string;

  @Field({ nullable: true })
  startsWith?: string;

  @Field({ nullable: true })
  endsWith?: string;

  @Field(() => [String], { nullable: true })
  in?: string[];

  @Field(() => Boolean, { nullable: true })
  isNil?: boolean;
}
