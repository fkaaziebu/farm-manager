import { Field, InputType } from "@nestjs/graphql";
import { TaskStatus } from "../../../database/types/task.type";

@InputType()
export class TaskInput {
  @Field()
  completionDate: string;

  @Field()
  description: string;

  @Field()
  startingDate: number;

  @Field(() => TaskStatus, { nullable: false })
  status: TaskStatus;
}
