import { Field, InputType } from "@nestjs/graphql";
import {
  GrowthPeriod,
  GrowthRecordType,
} from "../../../database/types/growth-record.type";

@InputType()
export class GrowthRecordInput {
  @Field({ nullable: true })
  feedConversion?: number;

  @Field({ nullable: true })
  growthRate?: number;

  @Field({ nullable: true })
  height?: number;

  @Field({ nullable: true })
  length?: number;

  @Field()
  notes: string;

  @Field()
  recordDate: Date;

  @Field()
  weight: number;

  @Field(() => GrowthPeriod, { nullable: false })
  period: GrowthPeriod;

  @Field(() => GrowthRecordType, { nullable: true })
  recordType?: GrowthRecordType;
}
