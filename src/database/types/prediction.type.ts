import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { FarmTypeClass } from "./farm.type";
import { FeedbackType } from "./feedback.type";
import { LeafDetectionType } from "./leaf-detection.type";

export enum PredictionCropType {
  MAIZE = "MAIZE",
  CASSAVA = "CASSAVA",
}

export enum ModelType {
  MODEL_1 = "MODEL_1",
  MODEL_2 = "MODEL_2",
}

registerEnumType(PredictionCropType, {
  name: "PredictionCropType",
  description: "Type of crop we are predicting for",
});

registerEnumType(ModelType, {
  name: "ModelType",
  description: "Model for the prediction",
});

@ObjectType("Prediction")
export class PredictionType {
  @Field(() => ID)
  id: string;

  @Field(() => PredictionCropType)
  crop_type: PredictionCropType;

  @Field(() => ModelType)
  model_used: ModelType;

  @Field()
  image_path: string;

  @Field()
  processing_time_ms: number;

  @Field()
  inserted_at: Date;

  @Field()
  updated_at: Date;

  @Field(() => FeedbackType, { nullable: true })
  feedback?: FeedbackType;

  @Field(() => [LeafDetectionType], { nullable: true })
  leaf_detections?: LeafDetectionType[];

  @Field(() => FarmTypeClass)
  farm: FarmTypeClass;
}
