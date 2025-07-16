import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { WorkerType } from "./worker.type";
import { AdminType } from "./admin.type";
import { LivestockTypeClass } from "./livestock.type";
import { PoultryBatchType } from "./poultry-batch.type";
import { AquacultureBatchType } from "./aquaculture-batch.type";
import { CropBatchType } from "./crop-batch.type";
import { HiveType } from "./hive.type";
import { TaskTypeClass } from "./task.type";
import { BarnType } from "./barn.type";
import { AquacultureSystemTypeClass } from "./aquaculture-system.type";
import { PondType } from "./pond.type";
import { FieldType } from "./field.type";
import { GreenhouseType } from "./greenhouse.type";
import { ApiaryType } from "./apiary.type";
import { PoultryHouseType } from "./poultry-house.type";
import { CoopType } from "./coop.type";
import { PenType } from "./pen.type";
import { ReportType } from "./report.type";
import { PredictionType } from "./prediction.type";

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
  latitude: number;

  @Field()
  longitude: number;

  @Field()
  performance: number;

  // We're not including the full relationships here to avoid circular references
  @Field(() => AdminType, { nullable: true })
  admin?: AdminType;

  @Field(() => [WorkerType], { nullable: true })
  workers?: WorkerType[];

  @Field(() => [BarnType], { nullable: true })
  barns?: BarnType[];

  @Field(() => [AquacultureSystemTypeClass], { nullable: true })
  aquaculture_systems?: AquacultureSystemTypeClass[];

  @Field(() => [PondType], { nullable: true })
  ponds: PondType[];

  @Field(() => [FieldType], { nullable: true })
  fields: FieldType[];

  @Field(() => [GreenhouseType], { nullable: true })
  greenhouses: GreenhouseType[];

  @Field(() => [ApiaryType], { nullable: true })
  apiaries: ApiaryType[];

  @Field(() => [PoultryHouseType], { nullable: true })
  poultry_houses: PoultryHouseType[];

  @Field(() => [CoopType], { nullable: true })
  coops: CoopType[];

  @Field(() => [PenType], { nullable: true })
  pens: PenType[];

  @Field(() => [LivestockTypeClass], { nullable: true })
  livestock?: LivestockTypeClass[];

  @Field(() => [PoultryBatchType], { nullable: true })
  poultry_batches?: PoultryBatchType[];

  @Field(() => [AquacultureBatchType], { nullable: true })
  aquaculture_batches?: AquacultureBatchType[];

  @Field(() => [CropBatchType], { nullable: true })
  crop_batches?: CropBatchType[];

  @Field(() => [HiveType], { nullable: true })
  hives?: HiveType[];

  @Field(() => [TaskTypeClass], { nullable: true })
  tasks?: TaskTypeClass[];

  @Field(() => [ReportType], { nullable: true })
  reports?: ReportType[];

  @Field(() => [PredictionType], { nullable: true })
  predictions?: PredictionType[];
}
