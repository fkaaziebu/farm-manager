import { Field, ID, ObjectType } from "@nestjs/graphql";
import { FarmTypeClass } from "./farm.type";
import { WorkerType } from "./worker.type";

@ObjectType("Report")
export class ReportType {
  @Field(() => ID)
  id: number;

  @Field()
  report_tag: string;

  @Field(() => WorkerType, { nullable: true })
  worker?: WorkerType;

  @Field(() => FarmTypeClass, { nullable: true })
  farm?: FarmTypeClass;
}
