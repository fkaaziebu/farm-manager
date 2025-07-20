import { Field, InputType } from "@nestjs/graphql";
import { DiseaseType } from "src/database/types/leaf-detection.type";
import {
  ModelType,
  PredictionCropType,
} from "src/database/types/prediction.type";

@InputType()
export class PredictionFilterInput {
  @Field(() => String, { nullable: true })
  farmTag?: string;

  @Field(() => ModelType, { nullable: true })
  modelUsed?: ModelType;

  @Field(() => PredictionCropType, { nullable: true })
  cropType?: PredictionCropType;

  @Field(() => DiseaseType, { nullable: true })
  predictedDisease?: DiseaseType;
}
