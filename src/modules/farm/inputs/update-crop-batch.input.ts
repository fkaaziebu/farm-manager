import { Field, InputType } from "@nestjs/graphql";
import {
  CropStatus,
  CropType,
  IrrigationMethod,
  PlantingMethod,
} from "src/database/types/crop-batch.type";
import GraphQLJSON from "graphql-type-json";

@InputType()
export class UpdateCropBatchInput {
  @Field({ nullable: true })
  name?: string;

  @Field(() => CropType, { nullable: true })
  cropType?: CropType;

  @Field({ nullable: true })
  variety?: string;

  @Field({ nullable: true })
  plantingDate?: Date;

  @Field({ nullable: true })
  harvestDate?: Date;

  @Field(() => PlantingMethod, { nullable: true })
  plantingMethod?: PlantingMethod;

  @Field(() => IrrigationMethod, { nullable: true })
  irrigationMethod?: IrrigationMethod;

  @Field({ nullable: true })
  areaPlanted?: number;

  @Field({ nullable: true })
  areaUnit?: string;

  @Field({ nullable: true })
  plantsCount?: number;

  @Field({ nullable: true })
  seedAmount?: number;

  @Field({ nullable: true })
  seedUnit?: string;

  @Field({ nullable: true })
  expectedYield?: number;

  @Field({ nullable: true })
  actualYield?: number;

  @Field({ nullable: true })
  yieldUnit?: string;

  @Field(() => GraphQLJSON, { nullable: true })
  fertilizerApplications?: any;

  @Field(() => GraphQLJSON, { nullable: true })
  pesticideApplications?: any;

  @Field(() => GraphQLJSON, { nullable: true })
  weatherConditions?: any;

  @Field(() => CropStatus, { nullable: true })
  status?: CropStatus;
}
