import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { FarmTypeClass } from "./farm.type";
import { AdminType } from "./admin.type";
import { TaskTypeClass } from "./task.type";
import GraphQLJSON from "graphql-type-json";

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

  @Field({ nullable: true })
  join_date?: Date;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  address?: string;

  @Field(() => GraphQLJSON, { nullable: true })
  bio?: any;

  @Field(() => [String], { nullable: true })
  skills?: string[];

  @Field(() => [GraphQLJSON], { nullable: true })
  achievements?: any[];

  @Field(() => [FarmTypeClass], { nullable: true })
  farms?: FarmTypeClass[];

  @Field(() => AdminType, { nullable: true })
  admin?: AdminType;

  @Field(() => [TaskTypeClass], { nullable: true })
  assigned_tasks?: TaskTypeClass[];
}
