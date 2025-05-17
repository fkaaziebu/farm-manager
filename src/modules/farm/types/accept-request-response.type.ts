import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class AcceptRequestResponse {
  @Field()
  message: string;

  @Field()
  code: number;
}
