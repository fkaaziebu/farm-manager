import { Args, Context, Query, Resolver } from "@nestjs/graphql";
import { LlmService } from "./llm.service";
import { UseGuards } from "@nestjs/common";
import { GqlJwtAuthGuard } from "./guards/gql-jwt-auth.guard";
import { BreedingPairPredictionResponse } from "./types";

@Resolver()
export class LlmResolver {
  constructor(private readonly llmService: LlmService) {}

  @UseGuards(GqlJwtAuthGuard)
  @Query(() => BreedingPairPredictionResponse)
  livestockBreedingPairPrediction(
    @Context() context,
    @Args("livestockTag") livestockTag: string,
  ) {
    const { email } = context.req.user;
    return this.llmService.livestockBreedingPairPrediction({
      email,
      livestockTag,
    });
  }
}
