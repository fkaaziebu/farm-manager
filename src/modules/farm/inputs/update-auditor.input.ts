import { Field, InputType } from "@nestjs/graphql";
import { WorkerRole } from "../../../database/types/worker.type";

@InputType()
export class UpdateAuditorInput {
  @Field(() => [WorkerRole], { nullable: true })
  roles?: WorkerRole[];
}
