import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { WorkerType } from "./worker.type";
import { AdminType } from "./admin.type";
import { HousingUnitType } from "./housing-unit.type";
import { LivestockType, LivestockTypeClass } from "./livestock.type";
import { PoultryBatchType } from "./poultry-batch.type";
import { AquacultureBatchType } from "./aquaculture-batch.type";
import { CropBatchType } from "./crop-batch.type";
import { HiveType } from "./hive.type";
import { TaskType } from "./task.type";

export enum FarmType {
  LIVESTOCK = "LIVESTOCK",
  POULTRY = "POULTRY",
  AQUACULTURE = "AQUACULTURE",
  CROP = "CROP",
  APIARY = "APIARY",
  MIXED = "MIXED",
}

registerEnumType(FarmType, {
  name: "FarmType",
  description: "Type of farm operation",
});

@ObjectType("Farm")
export class FarmTypeClass {
  @Field(() => ID)
  id: number;

  @Field()
  farm_tag: string;

  @Field()
  name: string;

  @Field(() => FarmType)
  farm_type: FarmType;

  @Field({ nullable: true })
  location?: string;

  @Field({ nullable: true })
  area?: string;

  @Field()
  performance: number;

  // We're not including the full relationships here to avoid circular references
  @Field(() => AdminType, { nullable: true })
  admin?: AdminType;

  @Field(() => [WorkerType], { nullable: true })
  workers?: WorkerType[];

  @Field(() => [HousingUnitType], { nullable: true })
  housingUnits?: HousingUnitType[];

  @Field(() => [LivestockTypeClass], { nullable: true })
  livestock?: LivestockTypeClass[];

  @Field(() => [PoultryBatchType], { nullable: true })
  poultryBatches?: PoultryBatchType[];

  @Field(() => [AquacultureBatchType], { nullable: true })
  aquacultureBatches?: AquacultureBatchType[];

  @Field(() => [CropBatchType], { nullable: true })
  cropBatches?: CropBatchType[];

  @Field(() => [HiveType], { nullable: true })
  hives?: HiveType[];

  @Field(() => [TaskType], { nullable: true })
  tasks?: TaskType[];
}
