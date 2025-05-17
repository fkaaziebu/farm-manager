import { Field, ID, ObjectType } from "@nestjs/graphql";
import { FarmTypeClass } from "./farm.type";
import { AdminType } from "./admin.type";
import { WorkerType } from "./worker.type";

@ObjectType("Group")
export class GroupType {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field(() => AdminType, { nullable: true })
  admin?: AdminType;

  @Field(() => [WorkerType], { nullable: true })
  workers?: WorkerType[];

  @Field(() => [FarmTypeClass], { nullable: true })
  farms?: FarmTypeClass[];
}
