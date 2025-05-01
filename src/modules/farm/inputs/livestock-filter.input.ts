import { Field, InputType } from "@nestjs/graphql";
import { LivestockType } from "src/database/types";

@InputType()
export class LivestockFilterInput {
  @Field(() => LivestockType, { nullable: true })
  livestock_type?: LivestockType;
}
