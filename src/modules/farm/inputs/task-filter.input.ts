import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class TaskFilterInput {
  @Field(() => String, { nullable: true })
  farmTag?: string;
}
