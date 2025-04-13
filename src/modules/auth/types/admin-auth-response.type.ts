import { Field, ObjectType } from "@nestjs/graphql";
import { AdminType } from "src/database/types";

@ObjectType()
export class AdminAuthResponse extends AdminType {
  @Field()
  token: string;
}
