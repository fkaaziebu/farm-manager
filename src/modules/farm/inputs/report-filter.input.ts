import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class ReportFilterInput {
  @Field({ nullable: true })
  reportId?: string;
}
