import { Field, InputType } from "@nestjs/graphql";
import { LivestockGender, LivestockType } from "../../../database/types";

@InputType()
export class UpdateLivestockInput {
  @Field({ nullable: true })
  birthDate?: Date;

  @Field({ nullable: true })
  milkProduction?: number;

  @Field({ nullable: true })
  meatGrade?: string;

  @Field({ nullable: true })
  breed?: string;

  @Field({ nullable: true })
  weight?: number;

  @Field({ nullable: true })
  motherTag?: string;

  @Field({ nullable: true })
  fatherTag?: string;

  @Field(() => LivestockType, { nullable: true })
  livestockType?: LivestockType;

  @Field(() => LivestockGender, { nullable: true })
  gender?: LivestockGender;

  @Field(() => [String], { nullable: true })
  offspringTags?: string[];
}
