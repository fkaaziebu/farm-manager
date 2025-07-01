import { Field, InputType } from "@nestjs/graphql";
import GraphQLJSON from "graphql-type-json";
import {
  CropType,
  IrrigationMethod,
  PlantingMethod,
} from "src/database/types/crop-batch.type";

@InputType()
export class CropBatchInput {
  @Field({ nullable: true })
  cropBatchTag?: string;

  @Field()
  name: string;

  @Field(() => CropType)
  cropType: CropType;

  @Field()
  variety: string;

  @Field()
  plantingDate: Date;

  @Field({ nullable: true })
  harvestDate?: Date;

  @Field(() => PlantingMethod, { nullable: true })
  plantingMethod?: PlantingMethod;

  @Field(() => IrrigationMethod, { nullable: true })
  irrigationMethod?: IrrigationMethod;

  @Field(() => GraphQLJSON)
  gpsCoordinates: any;

  @Field({ nullable: true })
  areaPlanted?: number;

  @Field({ nullable: true })
  areaUnit?: string;

  @Field()
  plantsCount: number;
}
