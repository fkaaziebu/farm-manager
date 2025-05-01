import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { FarmTypeClass } from "./farm.type";
import { AdminType } from "./admin.type";
import { WorkerType } from "./worker.type";
import { BarnType } from "./barn.type";
import { PenType } from "./pen.type";

export enum TaskStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export enum TaskType {
  REGULAR_INSPECTION = "REGULAR_INSPECTION",
  TRAINING_SESSION = "TRAINING_SESSION",
  ELECTRIC_CHECK = "ELECTRIC_CHECK",
  MAINTENANCE = "MAINTENANCE",
  CLEANING = "CLEANING",
}

registerEnumType(TaskStatus, {
  name: "TaskStatus",
  description: "Status of a task",
});

registerEnumType(TaskType, {
  name: "TaskType",
  description: "Type of a task",
});

@ObjectType("Task")
export class TaskTypeClass {
  @Field(() => ID)
  id: number;

  @Field(() => TaskType)
  type: TaskType;

  @Field()
  description: string;

  @Field({ nullable: true })
  notes?: string;

  @Field()
  starting_date: Date;

  @Field()
  completion_date: Date;

  @Field(() => TaskStatus)
  status: TaskStatus;

  @Field(() => AdminType, { nullable: true })
  admin?: AdminType;

  @Field(() => WorkerType, { nullable: true })
  worker?: WorkerType;

  @Field(() => FarmTypeClass, { nullable: true })
  farm?: FarmTypeClass;

  @Field(() => [BarnType], { nullable: true })
  barns?: BarnType[];

  @Field(() => [PenType], { nullable: true })
  pens?: PenType[];
}
