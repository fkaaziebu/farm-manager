import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { LivestockTypeClass } from "./livestock.type";
import { PoultryBatchType } from "./poultry-batch.type";
import { AquacultureBatchType } from "./aquaculture-batch.type";

export enum HealthRecordType {
  INDIVIDUAL = "INDIVIDUAL",
  BATCH = "BATCH",
}

export enum HealthRecordStatus {
  HEALTHY = "HEALTHY",
  SICK = "SICK",
  TREATED = "TREATED",
  RECOVERING = "RECOVERING",
  CRITICAL = "CRITICAL",
}

registerEnumType(HealthRecordType, {
  name: "HealthRecordType",
  description: "Type of health record (individual or batch)",
});

registerEnumType(HealthRecordStatus, {
  name: "HealthRecordStatus",
  description: "Status of health record (individual or batch)",
});

@ObjectType("HealthRecord")
export class HealthRecordTypeClass {
  @Field(() => ID)
  id: number;

  @Field(() => HealthRecordType)
  record_type: HealthRecordType;

  @Field(() => HealthRecordStatus)
  record_status: HealthRecordStatus;

  @Field()
  record_date: Date;

  @Field()
  issue: string;

  @Field()
  symptoms: string;

  @Field()
  diagnosis: string;

  @Field()
  treatment: string;

  @Field({ nullable: true })
  medication?: string;

  @Field({ nullable: true })
  dosage?: string;

  @Field({ nullable: true })
  vet_name?: string;

  @Field()
  cost: number;

  @Field()
  notes: string;

  @Field(() => LivestockTypeClass, { nullable: true })
  livestock?: LivestockTypeClass;

  @Field(() => PoultryBatchType, { nullable: true })
  poultry_batch?: PoultryBatchType;

  @Field(() => AquacultureBatchType, { nullable: true })
  aquaculture_batch?: AquacultureBatchType;
}
