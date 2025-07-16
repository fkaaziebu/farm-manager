import { Field, InputType } from "@nestjs/graphql";
import GraphQLJSON from "graphql-type-json";
import { DiseaseType } from "src/database/types/leaf-detection.type";

@InputType()
export class LeafDetectionInput {
  @Field(() => GraphQLJSON, { nullable: false })
  bbox: any;

  @Field()
  detection_confidence: number;

  @Field(() => DiseaseType, { nullable: false })
  predicted_disease: DiseaseType;

  @Field()
  confidence: number;

  @Field(() => [DiseaseType], { nullable: false })
  top3_predictions: DiseaseType[];
}
