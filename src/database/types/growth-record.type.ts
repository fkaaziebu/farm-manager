import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { LivestockTypeClass } from "./livestock.type";
import { PoultryBatchType } from "./poultry-batch.type";
import { AquacultureBatchType } from "./aquaculture-batch.type";

export enum GrowthPeriod {
  BIRTH = "BIRTH",
  FOUR_WEEKS = "4_WEEKS",
  EIGHT_WEEKS = "8_WEEKS",
  TWELVE_WEEKS = "12_WEEKS",
  SIXTEEN_WEEKS = "16_WEEKS",
  TWENTY_WEEKS = "20_WEEKS",
  ADULTHOOD = "ADULTHOOD",
  CUSTOM = "CUSTOM",
}

export enum GrowthRecordType {
  INDIVIDUAL = "INDIVIDUAL",
  BATCH = "BATCH",
}

registerEnumType(GrowthPeriod, {
  name: "GrowthPeriod",
  description: "Period of growth record measurement",
});

registerEnumType(GrowthRecordType, {
  name: "GrowthRecordType",
  description: "Type of growth record (individual or batch)",
});

@ObjectType("GrowthRecord")
export class GrowthRecordTypeClass {
  @Field(() => ID)
  id: number;

  @Field(() => GrowthRecordType)
  record_type: GrowthRecordType;

  @Field(() => GrowthPeriod)
  period: GrowthPeriod;

  @Field()
  record_date: Date;

  @Field()
  weight: number;

  @Field({ nullable: true })
  height?: number;

  @Field({ nullable: true })
  length?: number;

  @Field({ nullable: true })
  growth_rate?: number;

  @Field({ nullable: true })
  feed_conversion?: number;

  @Field({ nullable: true })
  feed_consumption?: number;

  @Field()
  notes: string;

  @Field(() => LivestockTypeClass, { nullable: true })
  livestock?: LivestockTypeClass;

  @Field(() => PoultryBatchType, { nullable: true })
  poultry_batch?: PoultryBatchType;

  @Field(() => AquacultureBatchType, { nullable: true })
  aquaculture_batch?: AquacultureBatchType;
}
