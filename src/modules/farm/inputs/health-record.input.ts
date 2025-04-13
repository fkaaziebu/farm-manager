import { Field, InputType } from "@nestjs/graphql";
import { GrowthRecordType } from "../../../database/types/growth-record.type";

@InputType()
export class HealthRecordInput {
  @Field()
  cost: number;

  @Field()
  diagnosis: string;

  @Field({ nullable: true })
  dosage: string;

  @Field()
  issue: string;

  @Field({ nullable: true })
  medication: string;

  @Field()
  notes: string;

  @Field()
  symptoms: string;

  @Field()
  treatment: string;

  @Field({ nullable: true })
  vetName: string;

  @Field()
  recordDate: Date;

  @Field(() => GrowthRecordType, { nullable: false })
  recordType: GrowthRecordType;
}
