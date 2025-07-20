import { Field, InputType } from "@nestjs/graphql";
import GraphQLJSON from "graphql-type-json";
import {
  CropKind,
  CropType,
  IrrigationMethod,
  PlantingMethod,
} from "src/database/types/crop-batch.type";

@InputType()
export class CropBatchInput {
  @Field()
  name: string;

  @Field(() => CropType)
  cropType: CropType;

  @Field(() => CropKind)
  cropKind: CropKind;

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
