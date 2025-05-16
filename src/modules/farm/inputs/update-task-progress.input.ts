import { Field, InputType } from "@nestjs/graphql";
import { TaskStatus } from "../../../database/types/task.type";

@InputType()
export class UpdateTaskProgressInput {
  @Field()
  startedAt: Date;

  @Field({ nullable: true })
  completedAt?: Date;

  @Field(() => TaskStatus)
  status: TaskStatus;
}
