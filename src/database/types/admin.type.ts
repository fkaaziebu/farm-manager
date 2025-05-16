import { Field, ID, ObjectType } from "@nestjs/graphql";
import { FarmTypeClass } from "./farm.type";
import { WorkerType } from "./worker.type";
import { TaskTypeClass } from "./task.type";
import { ReviewType } from "./review.type";

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

  @Field(() => [TaskTypeClass], { nullable: true })
  assigned_tasks?: TaskTypeClass[];

  @Field(() => [ReviewType], { nullable: true })
  reviews?: ReviewType[];
}
