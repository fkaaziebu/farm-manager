import { Field, ID, ObjectType } from "@nestjs/graphql";
import { FarmTypeClass } from "./farm.type";
import { AdminType } from "./admin.type";
import { WorkerType } from "./worker.type";
import { RequestTypeClass } from "./request.type";

@ObjectType("Group")
export class GroupType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => AdminType, { nullable: true })
  admin?: AdminType;

  @Field(() => [WorkerType], { nullable: true })
  workers?: WorkerType[];

  @Field(() => [FarmTypeClass], { nullable: true })
  farms?: FarmTypeClass[];

  @Field(() => [RequestTypeClass], { nullable: true })
  requests?: RequestTypeClass[];
}
