import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class WorkerIdInput {
  @Field(() => Number)
  id: number;
}
