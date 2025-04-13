import { Field, InputType } from "@nestjs/graphql";
import { WorkerRole } from "../../../database/types/worker.type";

@InputType()
export class WorkerInput {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field(() => [WorkerRole], { nullable: false })
  roles: WorkerRole[];
}
