import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class AuditorInput {
  @Field()
  name: string;

  @Field()
  email: string;
}
