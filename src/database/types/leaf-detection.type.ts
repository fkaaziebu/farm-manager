import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { PredictionType } from "./prediction.type";

export enum DiseaseType {
  DISEASE_1 = "DISEASE_1",
  DISEASE_2 = "DISEASE_2",
}

registerEnumType(DiseaseType, {
  name: "DiseaseType",
  description: "Type of disease affecting crop",
});

@ObjectType("LeafDetection")
export class LeafDetectionType {
  @Field(() => ID)
  id: string;

  @Field()
  detection_confidence: number;

  @Field(() => DiseaseType)
  predicted_disease: DiseaseType;

  @Field()
  confidence: number;

  @Field(() => [DiseaseType])
  top3_predictions: DiseaseType[];

  @Field(() => [PredictionType])
  prediction: PredictionType;
}
