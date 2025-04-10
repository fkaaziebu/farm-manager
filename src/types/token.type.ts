import { Field, ObjectType } from "@nestjs/graphql";
import { AdminType } from "./admin.type";
import { WorkerType } from "./worker.type";

@ObjectType("AdminToken")
export class AdminTokenType {
  @Field(() => AdminType)
  user: AdminType;

  @Field()
  role: string;

  @Field()
  token: string;
}

@ObjectType("WorkerToken")
export class WorkerTokenType {
  @Field(() => WorkerType)
  user: WorkerType;

  @Field()
  role: string;

  @Field()
  token: string;
}
