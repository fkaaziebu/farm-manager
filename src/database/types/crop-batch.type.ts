import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { FarmTypeClass } from "./farm.type";
import { ExpenseRecordType } from "./expense-record.type";
import { SalesRecordType } from "./sales-record.type";
import { FieldType } from "./field.type";
import { GreenhouseType } from "./greenhouse.type";
import { GraphQLJSON } from "graphql-type-json";

export enum CropType {
  GRAIN = "GRAIN",
  VEGETABLE = "VEGETABLE",
  FRUIT = "FRUIT",
  LEGUME = "LEGUME",
  ROOT = "ROOT",
  TUBER = "TUBER",
  FODDER = "FODDER",
  FIBER = "FIBER",
  OIL = "OIL",
  HERB = "HERB",
  SPICE = "SPICE",
  OTHER = "OTHER",
}

export enum CropKind {
  MAIZE = "MAIZE",
  CASHEW = "CASHEW",
  CASSAVA = "CASSAVA",
  TOMATO = "TOMATO",
}

export enum CropStatus {
  SEEDLING = "SEEDLING",
  GROWING = "GROWING",
  FLOWERING = "FLOWERING",
  FRUITING = "FRUITING",
  READY_FOR_HARVEST = "READY_FOR_HARVEST",
  HARVESTED = "HARVESTED",
  FAILED = "FAILED",
}

export enum PlantingMethod {
  DIRECT_SEEDING = "DIRECT_SEEDING",
  TRANSPLANTING = "TRANSPLANTING",
  CUTTING = "CUTTING",
  GRAFTING = "GRAFTING",
  LAYERING = "LAYERING",
  DIVISION = "DIVISION",
}

export enum IrrigationMethod {
  DRIP = "DRIP",
  SPRINKLER = "SPRINKLER",
  FLOOD = "FLOOD",
  FURROW = "FURROW",
  RAIN_FED = "RAIN_FED",
  MANUAL = "MANUAL",
}

registerEnumType(CropType, {
  name: "CropType",
  description: "Type of crop",
});

registerEnumType(CropKind, {
  name: "CropKind",
  description: "Kind of crop",
});

registerEnumType(CropStatus, {
  name: "CropStatus",
  description: "Growth status of a crop",
});

registerEnumType(PlantingMethod, {
  name: "PlantingMethod",
  description: "Method used for planting",
});

registerEnumType(IrrigationMethod, {
  name: "IrrigationMethod",
  description: "Method used for irrigation",
});

@ObjectType("CropBatch")
export class CropBatchType {
  @Field(() => ID)
  id: string;

  @Field()
  crop_batch_tag: string;

  @Field()
  name: string;

  @Field(() => CropType)
  crop_type: CropType;

  @Field(() => CropKind, { nullable: true })
  crop_kind?: CropKind;

  @Field()
  variety: string;

  @Field()
  planting_date: Date;

  @Field({ nullable: true })
  harvest_date?: Date;

  @Field(() => PlantingMethod)
  planting_method: PlantingMethod;

  @Field(() => IrrigationMethod)
  irrigation_method: IrrigationMethod;

  @Field()
  area_planted: number;

  @Field()
  area_unit: string;

  @Field()
  plants_count: number;

  @Field()
  seed_amount: number;

  @Field({ nullable: true })
  seed_unit: string;

  @Field()
  expected_yield: number;

  @Field()
  actual_yield: number;

  @Field({ nullable: true })
  yield_unit: string;

  @Field(() => GraphQLJSON, { nullable: true })
  gps_coordinates?: any;

  @Field(() => GraphQLJSON, { nullable: true })
  fertilizer_applications?: any;

  @Field(() => GraphQLJSON, { nullable: true })
  pesticide_applications?: any;

  @Field(() => GraphQLJSON, { nullable: true })
  weather_conditions?: any;

  @Field(() => CropStatus)
  status: CropStatus;

  @Field(() => FarmTypeClass, { nullable: true })
  farm?: FarmTypeClass;

  @Field(() => FieldType, { nullable: true })
  field?: FieldType;

  @Field(() => GreenhouseType, { nullable: true })
  greenhouse?: GreenhouseType;

  @Field(() => [ExpenseRecordType], { nullable: true })
  expense_records?: ExpenseRecordType[];

  @Field(() => [SalesRecordType], { nullable: true })
  sales_records?: SalesRecordType[];

  @Field()
  inserted_at: Date;

  @Field()
  updated_at: Date;
}
