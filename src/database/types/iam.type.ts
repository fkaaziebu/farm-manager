import { Field, ID, ObjectType } from "@nestjs/graphql";
import { AdminType } from "./admin.type";

@ObjectType("Iam")
export class IamType {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field()
  iam_identifier: string;

  @Field(() => AdminType)
  admin: AdminType;
}
