import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { PredictionType } from "./prediction.type";
import GraphQLJSON from "graphql-type-json";

export enum DiseaseType {
  ANTHRACNOSE = "ANTHRACNOSE",
  GUMOSIS = "GUMOSIS",
  HEALTHY = "HEALTHY",
  LEAF_MINER = "LEAF_MINER",
  RED_RUST = "RED_RUST",
  BACTERIAL_BLIGHT = "BACTERIAL_BLIGHT",
  BROWN_SPOT = "BROWN_SPOT",
  GREEN_MITE = "GREEN_MITE",
  MOSAIC = "MOSAIC",
  FALL_ARMYWORM = "FALL_ARMYWORM",
  GRASSHOPER = "GRASSHOPER",
  LEAF_BEETLE = "LEAF_BEETLE",
  LEAF_BLIGHT = "LEAF_BLIGHT",
  LEAF_SPOT = "LEAF_SPOT",
  STREAK_VIRUS = "STREAK_VIRUS",
  LEAF_CURL = "LEAF_CURL",
  SEPTORIA_LEAF_SPOT = "SEPTORIA_LEAF_SPOT",
  VERTICILLIUM_WILT = "VERTICILLIUM_WILT",
}

registerEnumType(DiseaseType, {
  name: "DiseaseType",
  description: "Type of disease affecting crop",
});

@ObjectType("LeafDetection")
export class LeafDetectionType {
  @Field(() => ID)
  id: string;

  @Field(() => GraphQLJSON, { nullable: false })
  bbox: any;

  @Field()
  detection_confidence: number;

  @Field(() => DiseaseType, { nullable: true })
  predicted_disease?: DiseaseType;

  @Field()
  confidence: number;

  @Field(() => GraphQLJSON, { nullable: true })
  top3_predictions?: any;

  @Field(() => [PredictionType])
  prediction: PredictionType;
}
