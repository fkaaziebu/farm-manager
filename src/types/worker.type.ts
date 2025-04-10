import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { FarmType } from "./farm.type";
import { AdminType } from "./admin.type";
import { WorkerRole } from "src/entities/worker.entity";

registerEnumType(WorkerRole, {
  name: "WorkerRole",
});

@ObjectType("Worker")
export class WorkerType {
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

  @Field(() => [WorkerRole])
  roles: WorkerRole[];

  // Password and reset fields omitted for security

  @Field(() => [FarmType], { nullable: true })
  farms?: FarmType[];

  @Field(() => AdminType, { nullable: true })
  admin?: AdminType;
}
