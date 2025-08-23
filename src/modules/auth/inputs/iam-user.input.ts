import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class IamUserInput {
  @Field()
  name: string;

  @Field()
  password: string;
}
