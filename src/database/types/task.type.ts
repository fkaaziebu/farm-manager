import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { FarmTypeClass } from "./farm.type";
import { AdminType } from "./admin.type";
import { WorkerType } from "./worker.type";

export enum TaskStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

registerEnumType(TaskStatus, {
  name: "TaskStatus",
  description: "Status of a task",
});

@ObjectType("Task")
export class TaskType {
  @Field(() => ID)
  id: number;

  @Field()
  description: string;

  @Field()
  starting_date: Date;

  @Field()
  completion_date: Date;

  @Field(() => TaskStatus)
  status: TaskStatus;

  @Field(() => AdminType, { nullable: true })
  admin?: AdminType;

  @Field(() => [WorkerType], { nullable: true })
  workers?: WorkerType[];

  @Field(() => FarmTypeClass, { nullable: true })
  farm?: FarmTypeClass;
}
