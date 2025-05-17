import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class RequestToJoinResponse {
  @Field()
  message: string;

  @Field()
  code: number;
}
