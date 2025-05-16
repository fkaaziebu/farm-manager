import { Field, ObjectType } from "@nestjs/graphql";
import { LivestockTypeClass } from "src/database/types";

@ObjectType()
export class BreedingPairPredictionResponse {
  @Field(() => [LivestockTypeClass])
  breedingPairs: LivestockTypeClass[];
}
