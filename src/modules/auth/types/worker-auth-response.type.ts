import { Field, ObjectType } from "@nestjs/graphql";
import { WorkerType } from "src/database/types";

@ObjectType()
export class WorkerAuthResponse extends WorkerType {
  @Field()
  token: string;
}
