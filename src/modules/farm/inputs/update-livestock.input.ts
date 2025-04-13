import { Field, InputType } from "@nestjs/graphql";
import { LivestockGender, LivestockType } from "../../../database/types";

@InputType()
export class UpdateLivestockInput {
  @Field()
  birth_date: Date;

  @Field()
  breed: string;

  @Field()
  weight: number;

  @Field(() => LivestockType, { nullable: false })
  livestockType: LivestockType;

  @Field(() => LivestockGender, { nullable: false })
  gender: LivestockGender;
}
