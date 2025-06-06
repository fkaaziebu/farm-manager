import { Field, InputType } from "@nestjs/graphql";
import { HealthRecordStatus } from "src/database/types/health-record.type";

@InputType()
export class UpdateHealthRecordInput {
  @Field({ nullable: true })
  cost?: number;

  @Field({ nullable: true })
  diagnosis?: string;

  @Field({ nullable: true })
  dosage?: string;

  @Field({ nullable: true })
  issue?: string;

  @Field({ nullable: true })
  medication?: string;

  @Field({ nullable: true })
  notes?: string;

  @Field({ nullable: true })
  symptoms?: string;

  @Field({ nullable: true })
  treatment?: string;

  @Field({ nullable: true })
  vetName?: string;

  @Field({ nullable: true })
  recordDate?: Date;

  @Field(() => HealthRecordStatus, { nullable: true })
  recordStatus?: HealthRecordStatus;
}
