import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { FarmTypeClass } from "./farm.type";
import { AdminType } from "./admin.type";
import { TaskType } from "./task.type";

export enum WorkerRole {
  FARM_MANAGER = "FARM_MANAGER",
  VETERINARIAN = "VETERINARIAN",
  FEED_SPECIALIST = "FEED_SPECIALIST",
  ANIMAL_CARETAKER = "ANIMAL_CARETAKER",
  CROP_SPECIALIST = "CROP_SPECIALIST",
  MAINTENANCE = "MAINTENANCE",
  GENERAL_WORKER = "GENERAL_WORKER",
}

registerEnumType(WorkerRole, {
  name: "WorkerRole",
  description: "The roles a worker can have on the farm",
});

@ObjectType("Worker")
export class WorkerType {
  @Field(() => ID)
  id: number;

  @Field()
  worker_tag: string;

  @Field()
  name: string;

  @Field(() => [WorkerRole])
  roles: WorkerRole[];

  @Field()
  email: string;

  @Field(() => [FarmTypeClass], { nullable: true })
  farms?: FarmTypeClass[];

  @Field(() => AdminType, { nullable: true })
  admin?: AdminType;

  @Field(() => [TaskType], { nullable: true })
  assigned_tasks?: TaskType[];
}
