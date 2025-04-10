import { Field, ID, ObjectType } from "@nestjs/graphql";
import { FarmType } from "./farm.type";
import { WorkerType } from "./worker.type";

@ObjectType("Admin")
export class AdminType {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  role: string;

  @Field()
  token: string;

  @Field(() => [FarmType], { nullable: true })
  farms?: FarmType[];

  @Field(() => [WorkerType], { nullable: true })
  workers?: WorkerType[];
}
