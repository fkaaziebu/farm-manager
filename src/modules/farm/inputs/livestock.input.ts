import { Field, InputType } from "@nestjs/graphql";
import { LivestockGender, LivestockType } from "../../../database/types";

@InputType()
export class LivestockInput {
  @Field({ nullable: true })
  livestockTag?: string;

  @Field()
  birthDate: Date;

  @Field()
  breed: string;

  @Field()
  weight: number;

  @Field(() => LivestockType, { nullable: false })
  livestockType: LivestockType;

  @Field(() => LivestockGender, { nullable: false })
  gender: LivestockGender;
}
