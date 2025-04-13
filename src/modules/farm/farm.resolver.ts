import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { FarmType, FarmTypeClass } from "src/database/types/farm.type";
import { FarmService } from "./farm.service";
import { UseGuards } from "@nestjs/common";
import { GqlJwtAuthGuard } from "./guards/gql-jwt-auth.guard";
import { RolesGuard } from "./guards/roles.guard";
import { Roles } from "./decorators/roles.decorator";
import {
  BarnInput,
  BreedingRecordInput,
  ExpenseRecordInput,
  GrowthRecordInput,
  HealthRecordInput,
  LivestockInput,
  PenInput,
  TaskInput,
  UpdateBreedingRecordInput,
  UpdateExpenseRecordInput,
  UpdateGrowthRecordInput,
  UpdateHealthRecordInput,
  UpdateLivestockInput,
  WorkerInput,
} from "./inputs";
import {
  BarnType,
  LivestockTypeClass,
  PenType,
  TaskType,
} from "src/database/types";

@Resolver()
export class FarmResolver {
  constructor(private readonly farmService: FarmService) {}

  // Queries
  @UseGuards(GqlJwtAuthGuard)
  @Query(() => [FarmTypeClass])
  listFarms() {}

  @UseGuards(GqlJwtAuthGuard)
  @Query(() => [BarnType])
  listBarns(@Args("searchTerm") searchTerm: string) {}

  @UseGuards(GqlJwtAuthGuard)
  @Query(() => [PenType])
  listPens(@Args("searchTerm") searchTerm: string) {}

  @UseGuards(GqlJwtAuthGuard)
  @Query(() => [LivestockTypeClass])
  listLivestock(@Args("searchTerm") searchTerm: string) {}

  @UseGuards(GqlJwtAuthGuard)
  @Query(() => LivestockTypeClass)
  getLivestock(@Args("livestockTag") livestockTag: string) {}

  // Mutations
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Mutation(() => FarmTypeClass)
  createFarm(
    @Context() context,
    @Args("name") name: string,
    @Args("location") location: string,
    @Args("area") area: string,
    @Args("farmType", { type: () => FarmType }) farmType: FarmType,
  ) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Mutation(() => FarmTypeClass)
  updateFarm(
    @Context() context,
    @Args("farmTag") farmTag: string,
    @Args("name", { nullable: true }) name?: string,
    @Args("location", { nullable: true }) location?: string,
    @Args("area", { nullable: true }) area?: string,
    @Args("farmType", { type: () => FarmType, nullable: true })
    farmType?: FarmType,
  ) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Mutation(() => FarmTypeClass)
  assignWorkersToFarm(
    @Context() context,
    @Args("farmTag") farmTag: string,
    @Args("workerTags", { type: () => [String!]!, nullable: false })
    workerTags: string[],
  ) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Mutation(() => FarmTypeClass)
  addWorkersToFarm(
    @Context() context,
    @Args("farmTag") farmTag: string,
    @Args("workers", { type: () => [WorkerInput!]!, nullable: false })
    workers: WorkerInput[],
  ) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Mutation(() => FarmTypeClass)
  addBarnsToFarm(
    @Context() context,
    @Args("farmTag") farmTag: string,
    @Args("barns", { type: () => [BarnInput!]!, nullable: false })
    barns: BarnInput[],
  ) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Mutation(() => BarnType)
  updateBarn(
    @Context() context,
    @Args("barnUnitId") barnUnitId: string,
    @Args("barn", { type: () => BarnInput, nullable: false })
    barn: BarnInput,
  ) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Mutation(() => FarmTypeClass)
  addPensToBarn(
    @Context() context,
    @Args("farmTag") farmTag: string,
    @Args("barnUnitId") barnUnitId: string,
    @Args("pens", { type: () => [PenInput!]!, nullable: false })
    pens: PenInput[],
  ) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Mutation(() => FarmTypeClass)
  addLivestockToPen(
    @Context() context,
    @Args("farmTag") farmTag: string,
    @Args("penUnitId") penUnitId: string,
    @Args("livestock", { type: () => [LivestockInput!]!, nullable: false })
    livestock: LivestockInput[],
  ) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Mutation(() => FarmTypeClass)
  updateLivestock(
    @Context() context,
    @Args("livestockTag") livestockTag: string,
    @Args("livestock", { type: () => UpdateLivestockInput, nullable: false })
    livestock: UpdateLivestockInput,
  ) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Mutation(() => TaskType)
  createTask(
    @Context() context,
    @Args("task", { type: () => TaskInput!, nullable: false })
    task: TaskInput,
  ) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Mutation(() => TaskType)
  assignTaskToWorkers(
    @Context() context,
    @Args("taskId") taskId: string,
    @Args("workerTags", { type: () => [String!]!, nullable: false })
    workerTags: string[],
  ) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Mutation(() => LivestockTypeClass)
  addLivestockBreedingRecord(
    @Context() context,
    @Args("livestockTag") livestockTag: string,
    @Args("breedingRecord", {
      type: () => BreedingRecordInput!,
      nullable: false,
    })
    breedingRecord: BreedingRecordInput,
  ) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Mutation(() => LivestockTypeClass)
  updateLivestockBreedingRecord(
    @Context() context,
    @Args("breedingRecordId") breedingRecordId: string,
    @Args("breedingRecord", {
      type: () => UpdateBreedingRecordInput!,
      nullable: false,
    })
    breedingRecord: UpdateBreedingRecordInput,
  ) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Mutation(() => LivestockTypeClass)
  addLivestockHealthRecord(
    @Context() context,
    @Args("livestockTag") livestockTag: string,
    @Args("healthRecord", { type: () => HealthRecordInput!, nullable: false })
    healthRecord: HealthRecordInput,
  ) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Mutation(() => LivestockTypeClass)
  updateLivestockHealthRecord(
    @Context() context,
    @Args("healthRecordId") healthRecordId: string,
    @Args("healthRecord", {
      type: () => UpdateHealthRecordInput!,
      nullable: false,
    })
    healthRecord: UpdateHealthRecordInput,
  ) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Mutation(() => LivestockTypeClass)
  addLivestockGrowthRecord(
    @Context() context,
    @Args("livestockTag") livestockTag: string,
    @Args("growthRecord", { type: () => GrowthRecordInput!, nullable: false })
    growthRecord: GrowthRecordInput,
  ) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Mutation(() => LivestockTypeClass)
  updateLivestockGrowthRecord(
    @Context() context,
    @Args("growthRecordId") growthRecordId: string,
    @Args("growthRecord", {
      type: () => UpdateGrowthRecordInput!,
      nullable: false,
    })
    growthRecord: UpdateGrowthRecordInput,
  ) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Mutation(() => LivestockTypeClass)
  addLivestockExpenseRecord(
    @Context() context,
    @Args("livestockTag") livestockTag: string,
    @Args("expenseRecord", { type: () => ExpenseRecordInput!, nullable: false })
    expenseRecord: ExpenseRecordInput,
  ) {}

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Mutation(() => LivestockTypeClass)
  updateLivestockExpenseRecord(
    @Context() context,
    @Args("expenseRecordId") expenseRecordId: string,
    @Args("expenseRecord", {
      type: () => UpdateExpenseRecordInput!,
      nullable: false,
    })
    expenseRecord: UpdateExpenseRecordInput,
  ) {}
}
