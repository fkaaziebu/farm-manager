import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class RequestResetResponse {
  @Field()
  message: string;
}
