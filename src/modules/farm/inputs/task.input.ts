import { Field, InputType } from "@nestjs/graphql";
import { TaskStatus, TaskType } from "../../../database/types/task.type";

@InputType()
export class TaskInput {
  @Field()
  completionDate: Date;

  @Field()
  description: string;

  @Field(() => TaskType, { nullable: false })
  type: TaskType;

  @Field({ nullable: true })
  notes?: string;

  @Field()
  startingDate: Date;

  @Field(() => TaskStatus, { nullable: false })
  status: TaskStatus;
}
