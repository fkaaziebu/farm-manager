import { Field, InputType } from "@nestjs/graphql";
import {
  GrowthPeriod,
  GrowthRecordType,
} from "../../../database/types/growth-record.type";

@InputType()
export class UpdateGrowthRecordInput {
  @Field({ nullable: true })
  feedConsumption?: number;

  @Field({ nullable: true })
  growthRate?: number;

  @Field({ nullable: true })
  height?: number;

  @Field({ nullable: true })
  length?: number;

  @Field({ nullable: true })
  notes?: string;

  @Field({ nullable: true })
  recordDate?: Date;

  @Field({ nullable: true })
  weight?: number;

  @Field(() => GrowthPeriod, { nullable: true })
  period?: GrowthPeriod;
}
