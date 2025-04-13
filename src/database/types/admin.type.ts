import { Field, ID, ObjectType } from "@nestjs/graphql";
import { FarmTypeClass } from "./farm.type";
import { WorkerType } from "./worker.type";
import { TaskType } from "./task.type";

@ObjectType("Admin")
export class AdminType {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field(() => [FarmTypeClass], { nullable: true })
  farms?: FarmTypeClass[];

  @Field(() => [WorkerType], { nullable: true })
  workers?: WorkerType[];

  @Field(() => [TaskType], { nullable: true })
  assigned_tasks?: TaskType[];
}
