import { Field, InputType } from "@nestjs/graphql";
import {
  DiseaseType,
  ModelType,
  PredictionCropType,
} from "src/database/types/prediction.type";

@InputType()
export class PredictionFilterInput {
  @Field(() => ModelType, { nullable: true })
  modelUsed?: ModelType;

  @Field(() => PredictionCropType, { nullable: true })
  cropType?: PredictionCropType;

  @Field(() => DiseaseType, { nullable: true })
  predictedDisease?: DiseaseType;
}
