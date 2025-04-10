import { Field, InputType, registerEnumType } from "@nestjs/graphql";
import { WorkerRole } from "src/entities/worker.entity";

@InputType()
export class CreateWorkerInput {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field(() => WorkerRole, { nullable: false })
  role: WorkerRole;
}
