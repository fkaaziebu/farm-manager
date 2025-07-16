import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GqlJwtAuthGuard } from "./guards/gql-jwt-auth.guard";
import { RolesGuard } from "./guards/roles.guard";
import { UseGuards } from "@nestjs/common";
import { Roles } from "./decorators/roles.decorator";
import { PredictionType } from "src/database/types";
import { PredictionService } from "./prediction.service";
import {
  DiseaseType,
  ModelType,
  PredictionCropType,
} from "src/database/types/prediction.type";
import { PredictionFilterInput, PredictionSortInput } from "./inputs";
import { PaginationInput } from "src/database/inputs";
import { PredictionConnection } from "./types";

@Resolver()
export class PredictionResolver {
  constructor(private readonly predictionService: PredictionService) {}

  // Mutations
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin", "worker")
  @Mutation(() => PredictionType)
  submitPredictionFeedback(
    @Context() context,
    @Args("predictionId") predictionId: string,
    @Args("userFeedback") userFeedback: string,
    @Args("actualDisease", { type: () => DiseaseType })
    actualDisease: DiseaseType,
  ) {
    const { email, role } = context.req.user;
    return this.predictionService.submitPredictionFeedback({
      email,
      role,
      predictionId,
      userFeedback,
      actualDisease,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin", "worker")
  @Mutation(() => PredictionType)
  createPrediction(
    @Context() context,
    @Args("farmTag") farmTag: string,
    @Args("cropType", { type: () => PredictionCropType })
    cropType: PredictionCropType,
    @Args("modelUsed", { type: () => ModelType })
    modelUsed: ModelType,
    @Args("predictedDisease", { type: () => DiseaseType })
    predictedDisease: DiseaseType,
    @Args("confidence") confidence: number,
    @Args("top3Predictions", { type: () => [DiseaseType] })
    top3Predictions: DiseaseType[],
    @Args("imagePath") imagePath: string,
    @Args("processingTimeMs") processingTimeMs: number,
  ) {
    const { email, role } = context.req.user;
    return this.predictionService.createPrediction({
      email,
      role,
      farmTag,
      cropType,
      modelUsed,
      predictedDisease,
      top3Predictions,
      confidence,
      imagePath,
      processingTimeMs,
    });
  }

  // Queries
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Query(() => PredictionConnection)
  listPredictions(
    @Context() context,
    @Args("filter", { nullable: true }) filter?: PredictionFilterInput,
    @Args("pagination", { nullable: true }) pagination?: PaginationInput,
    @Args("sort", { type: () => [PredictionSortInput], nullable: true })
    sort?: PredictionSortInput[],
  ) {
    const { email, role } = context.req.user;
    return this.predictionService.listPredictionsPaginated({
      email,
      role,
      filter,
      pagination,
      sort,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Query(() => PredictionType)
  getPrediction(
    @Context() context,
    @Args("predictionId") predictionId: string,
  ) {
    const { email, role } = context.req.user;
    return this.predictionService.getPrediction({
      email,
      role,
      predictionId,
    });
  }
}
