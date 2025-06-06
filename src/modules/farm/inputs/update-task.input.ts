import { Field, InputType } from "@nestjs/graphql";
import { TaskStatus } from "../../../database/types/task.type";

@InputType()
export class UpdateTaskInput {
  @Field({ nullable: true })
  completionDate?: Date;

  @Field({ nullable: true })
  notes?: string;

  @Field({ nullable: true })
  startingDate?: Date;
}
