import { Args, Context, Query, Resolver } from "@nestjs/graphql";
import { LlmService } from "./llm.service";
import { UseGuards } from "@nestjs/common";
import { GqlJwtAuthGuard } from "./guards/gql-jwt-auth.guard";
import { BreedingPairPredictionResponse } from "./types";
import { RolesGuard } from "./guards/roles.guard";
import { Roles } from "./decorators/roles.decorator";

@Resolver()
export class LlmResolver {
  constructor(private readonly llmService: LlmService) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin", "worker")
  @Query(() => BreedingPairPredictionResponse)
  livestockBreedingPairPrediction(
    @Context() context,
    @Args("livestockTag") livestockTag: string,
  ) {
    const { email, role } = context.req.user;
    return this.llmService.livestockBreedingPairPrediction({
      email,
      livestockTag,
      role,
    });
  }
}
