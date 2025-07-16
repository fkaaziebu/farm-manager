import { Field, ID, ObjectType } from "@nestjs/graphql";
import { PredictionType } from "./prediction.type";
import { DiseaseType } from "./leaf-detection.type";

@ObjectType("Feedback")
export class FeedbackType {
  @Field(() => ID)
  id: string;

  @Field(() => DiseaseType)
  actual_disease: DiseaseType;

  @Field({ nullable: true })
  user_feedback?: string;

  @Field(() => [PredictionType])
  prediction: PredictionType;
}
