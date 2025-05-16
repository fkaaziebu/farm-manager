import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { FarmType, FarmTypeClass } from "src/database/types/farm.type";
import { FarmService } from "./farm.service";
import { UseGuards } from "@nestjs/common";
import { GqlJwtAuthGuard } from "./guards/gql-jwt-auth.guard";

import {
  BarnInput,
  BarnSortInput,
  BreedingRecordInput,
  ExpenseRecordInput,
  FarmFilterInput,
  FarmSortInput,
  GrowthRecordInput,
  HealthRecordInput,
  LivestockFilterInput,
  LivestockInput,
  LivestockSortInput,
  PenInput,
  PenSortInput,
  ReviewInput,
  SalesRecordInput,
  TaskFilterInput,
  TaskInput,
  UpdateBarnInput,
  UpdateBreedingRecordInput,
  UpdateExpenseRecordInput,
  UpdateGrowthRecordInput,
  UpdateHealthRecordInput,
  UpdateLivestockInput,
  UpdatePenInput,
  UpdateSalesRecordInput,
  UpdateTaskInput,
  UpdateTaskProgressInput,
  UpdateWorkerInput,
  WorkerInput,
} from "./inputs";
import {
  BarnType,
  BreedingRecordType,
  ExpenseRecordType,
  GrowthRecordTypeClass,
  HealthRecordTypeClass,
  LivestockTypeClass,
  PenType,
  SalesRecordType,
  TaskTypeClass,
  WorkerType,
} from "src/database/types";
import { LivestockUnavailabilityReason } from "src/database/types/livestock.type";
import {
  BarnConnection,
  FarmConnection,
  LivestockConnection,
  PenConnection,
  WorkerConnection,
} from "./types";
import { PaginationInput } from "src/database/inputs";
import { RolesGuard } from "./guards/roles.guard";
import { Roles } from "./decorators/roles.decorator";
import { ReviewType } from "../../database/types/review.type";

@Resolver()
export class FarmResolver {
  constructor(private readonly farmService: FarmService) {}

  // Queries
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin", "worker")
  @Query(() => FarmConnection)
  listFarms(
    @Context() context,
    @Args("searchTerm") searchTerm: string,
    @Args("filter", { nullable: true }) filter?: FarmFilterInput,
    @Args("pagination", { nullable: true }) pagination?: PaginationInput,
    @Args("sort", { type: () => [FarmSortInput], nullable: true })
    sort?: FarmSortInput[],
  ) {
    const { email, role } = context.req.user;
    return this.farmService.listFarmsPaginated({
      email,
      searchTerm,
      filter,
      pagination,
      sort,
      role,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Query(() => WorkerConnection)
  listWorkers(
    @Context() context,
    @Args("searchTerm") searchTerm: string,
    @Args("pagination", { nullable: true }) pagination?: PaginationInput,
  ) {
    const { email } = context.req.user;
    return this.farmService.listWorkersPaginated({
      email,
      searchTerm,
      pagination,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin", "worker")
  @Query(() => WorkerType)
  getWorker(@Context() context, @Args("workerTag") workerTag: string) {
    const { email, role } = context.req.user;
    return this.farmService.getWorker({
      email,
      workerTag,
      role,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin", "worker")
  @Query(() => [TaskTypeClass])
  listTask(
    @Context() context,
    @Args("filter", { nullable: true }) filter?: TaskFilterInput,
  ) {
    const { email, role } = context.req.user;
    return this.farmService.listTask({
      email,
      filter,
      role,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin", "worker")
  @Query(() => BarnConnection)
  listBarns(
    @Context() context,
    @Args("searchTerm") searchTerm: string,
    @Args("pagination", { nullable: true }) pagination?: PaginationInput,
    @Args("sort", { type: () => [BarnSortInput], nullable: true })
    sort?: BarnSortInput[],
  ) {
    const { email, role } = context.req.user;
    return this.farmService.listBarnsPaginated({
      email,
      searchTerm,
      pagination,
      sort,
      role,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin", "worker")
  @Query(() => BarnType)
  getBarn(@Context() context, @Args("barnUnitId") barnUnitId: string) {
    const { email, role } = context.req.user;
    return this.farmService.getBarn({
      email,
      barnUnitId,
      role,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin", "worker")
  @Query(() => PenConnection)
  listPens(
    @Context() context,
    @Args("searchTerm") searchTerm: string,
    @Args("pagination", { nullable: true }) pagination?: PaginationInput,
    @Args("sort", { type: () => [PenSortInput], nullable: true })
    sort?: PenSortInput[],
  ) {
    const { email, role } = context.req.user;
    return this.farmService.listPensPaginated({
      email,
      searchTerm,
      pagination,
      sort,
      role,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin", "worker")
  @Query(() => PenType)
  getPen(@Context() context, @Args("penUnitId") penUnitId: string) {
    const { email, role } = context.req.user;
    return this.farmService.getPen({
      email,
      penUnitId,
      role,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin", "worker")
  @Query(() => LivestockConnection)
  listLivestock(
    @Context() context,
    @Args("searchTerm") searchTerm: string,
    @Args("filter", { nullable: true }) filter?: LivestockFilterInput,
    @Args("pagination", { nullable: true }) pagination?: PaginationInput,
    @Args("sort", { type: () => [LivestockSortInput], nullable: true })
    sort?: LivestockSortInput[],
  ) {
    const { email, role } = context.req.user;
    return this.farmService.listLivestockPaginated({
      email,
      searchTerm,
      filter,
      pagination,
      sort,
      role,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin", "worker")
  @Query(() => LivestockTypeClass)
  getLivestock(@Context() context, @Args("livestockTag") livestockTag: string) {
    const { email, role } = context.req.user;
    return this.farmService.getLivestock({
      email,
      livestockTag,
      role,
    });
  }

  // Mutations
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Mutation(() => FarmTypeClass)
  createFarm(
    @Context() context,
    @Args("name") name: string,
    @Args("location") location: string,
    @Args("area") area: string,
    @Args("latitude") latitude: number,
    @Args("longitude") longitude: number,
    @Args("farmType", { type: () => FarmType }) farmType: FarmType,
  ) {
    const { email } = context.req.user;
    return this.farmService.createFarm({
      email,
      name,
      location,
      latitude,
      longitude,
      area,
      farmType,
    });
  }

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
  ) {
    const { email } = context.req.user;
    return this.farmService.updateFarm({
      farmTag,
      email,
      name,
      location,
      area,
      farmType,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Mutation(() => FarmTypeClass)
  assignWorkersToFarm(
    @Context() context,
    @Args("farmTag") farmTag: string,
    @Args("workerTags", { type: () => [String!]!, nullable: false })
    workerTags: string[],
  ) {
    const { email } = context.req.user;
    return this.farmService.assignWorkersToFarm({
      farmTag,
      email,
      workerTags,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Mutation(() => FarmTypeClass)
  addWorkersToFarm(
    @Context() context,
    @Args("farmTag") farmTag: string,
    @Args("workers", { type: () => [WorkerInput!]!, nullable: false })
    workers: WorkerInput[],
  ) {
    const { email } = context.req.user;
    return this.farmService.addWorkersToFarm({
      farmTag,
      email,
      workers,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Mutation(() => WorkerType)
  updateWorker(
    @Context() context,
    @Args("workerTag") workerTag: string,
    @Args("workerData", { type: () => UpdateWorkerInput!, nullable: false })
    workerData: WorkerInput,
  ) {
    const { email } = context.req.user;
    return this.farmService.updateWorker({
      workerTag,
      email,
      workerData,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Mutation(() => FarmTypeClass)
  addBarnsToFarm(
    @Context() context,
    @Args("farmTag") farmTag: string,
    @Args("barns", { type: () => [BarnInput!]!, nullable: false })
    barns: BarnInput[],
  ) {
    const { email } = context.req.user;

    return this.farmService.addBarnsToFarm({
      farmTag,
      email,
      barns,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Mutation(() => BarnType)
  updateBarn(
    @Context() context,
    @Args("barnUnitId") barnUnitId: string,
    @Args("barn", { type: () => UpdateBarnInput, nullable: false })
    barn: UpdateBarnInput,
  ) {
    const { email } = context.req.user;

    return this.farmService.updateBarn({
      email,
      barnUnitId,
      barn,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Mutation(() => BarnType)
  addPensToBarn(
    @Context() context,
    @Args("barnUnitId") barnUnitId: string,
    @Args("pens", { type: () => [PenInput!]!, nullable: false })
    pens: PenInput[],
  ) {
    const { email } = context.req.user;

    return this.farmService.addPensToBarn({
      email,
      barnUnitId,
      pens,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Mutation(() => PenType)
  updatePen(
    @Context() context,
    @Args("penUnitId") penUnitId: string,
    @Args("pen", { type: () => UpdatePenInput!, nullable: false })
    pen: UpdatePenInput,
  ) {
    const { email } = context.req.user;

    return this.farmService.updatePen({
      email,
      penUnitId,
      pen,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Mutation(() => PenType)
  addLivestockToPen(
    @Context() context,
    @Args("penUnitId") penUnitId: string,
    @Args("livestock", { type: () => [LivestockInput!]!, nullable: false })
    livestock: LivestockInput[],
  ) {
    const { email } = context.req.user;

    return this.farmService.addLivestockToPen({
      email,
      penUnitId,
      livestock,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Mutation(() => LivestockTypeClass)
  updateLivestock(
    @Context() context,
    @Args("livestockTag") livestockTag: string,
    @Args("livestock", { type: () => UpdateLivestockInput, nullable: false })
    livestock: UpdateLivestockInput,
  ) {
    const { email } = context.req.user;

    return this.farmService.updateLivestock({
      email,
      livestockTag,
      livestock,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin", "worker")
  @Mutation(() => LivestockTypeClass)
  markLivestockAsUnavailable(
    @Context() context,
    @Args("livestockTag") livestockTag: string,
    @Args("unavailabilityReason", {
      type: () => LivestockUnavailabilityReason,
      nullable: false,
    })
    unavailabilityReason: LivestockUnavailabilityReason,
  ) {
    const { email, role } = context.req.user;

    return this.farmService.markLivestockAsUnavailable({
      email,
      livestockTag,
      unavailabilityReason,
      role,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Mutation(() => TaskTypeClass)
  createTask(
    @Context() context,
    @Args("farmTag") farmTag: string,
    @Args("task", { type: () => TaskInput!, nullable: false })
    task: TaskInput,
  ) {
    const { email } = context.req.user;

    return this.farmService.createTask({
      email,
      farmTag,
      task,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Mutation(() => TaskTypeClass)
  updateTask(
    @Context() context,
    @Args("taskId") taskId: number,
    @Args("task", { type: () => UpdateTaskInput!, nullable: false })
    task: UpdateTaskInput,
  ) {
    const { email } = context.req.user;

    return this.farmService.updateTask({
      email,
      taskId,
      task,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("worker")
  @Mutation(() => TaskTypeClass)
  updateTaskProgress(
    @Context() context,
    @Args("taskId") taskId: number,
    @Args("task", { type: () => UpdateTaskProgressInput!, nullable: false })
    task: UpdateTaskProgressInput,
  ) {
    const { email } = context.req.user;

    return this.farmService.updateTaskProgress({
      email,
      taskId,
      task,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Mutation(() => TaskTypeClass)
  assignTaskToWorker(
    @Context() context,
    @Args("taskId") taskId: number,
    @Args("workerTag") workerTag: string,
  ) {
    const { email } = context.req.user;

    return this.farmService.assignTaskToWorker({
      email,
      taskId,
      workerTag,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin", "worker")
  @Mutation(() => BreedingRecordType)
  addLivestockBreedingRecord(
    @Context() context,
    @Args("maleLivestockTag") maleLivestockTag: string,
    @Args("femaleLivestockTag") femaleLivestockTag: string,
    @Args("breedingRecord", {
      type: () => BreedingRecordInput!,
      nullable: false,
    })
    breedingRecord: BreedingRecordInput,
  ) {
    const { email, role } = context.req.user;

    return this.farmService.addLivestockBreedingRecord({
      email,
      maleLivestockTag,
      femaleLivestockTag,
      breedingRecord,
      role,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin", "worker")
  @Mutation(() => BreedingRecordType)
  updateLivestockBreedingRecord(
    @Context() context,
    @Args("breedingRecordId") breedingRecordId: number,
    @Args("breedingRecord", {
      type: () => UpdateBreedingRecordInput!,
      nullable: false,
    })
    breedingRecord: UpdateBreedingRecordInput,
  ) {
    const { email, role } = context.req.user;

    return this.farmService.updateLivestockBreedingRecord({
      email,
      breedingRecordId,
      breedingRecord,
      role,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin", "worker")
  @Mutation(() => HealthRecordTypeClass)
  addLivestockHealthRecord(
    @Context() context,
    @Args("livestockTag") livestockTag: string,
    @Args("healthRecord", { type: () => HealthRecordInput!, nullable: false })
    healthRecord: HealthRecordInput,
  ) {
    const { email, role } = context.req.user;

    return this.farmService.addLivestockHealthRecord({
      email,
      livestockTag,
      healthRecord,
      role,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin", "worker")
  @Mutation(() => HealthRecordTypeClass)
  updateLivestockHealthRecord(
    @Context() context,
    @Args("healthRecordId") healthRecordId: number,
    @Args("healthRecord", {
      type: () => UpdateHealthRecordInput!,
      nullable: false,
    })
    healthRecord: UpdateHealthRecordInput,
  ) {
    const { email, role } = context.req.user;

    return this.farmService.updateLivestockHealthRecord({
      email,
      healthRecordId,
      healthRecord,
      role,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin", "worker")
  @Mutation(() => GrowthRecordTypeClass)
  addLivestockGrowthRecord(
    @Context() context,
    @Args("livestockTag") livestockTag: string,
    @Args("growthRecord", { type: () => GrowthRecordInput!, nullable: false })
    growthRecord: GrowthRecordInput,
  ) {
    const { email, role } = context.req.user;

    return this.farmService.addLivestockGrowthRecord({
      email,
      livestockTag,
      growthRecord,
      role,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin", "worker")
  @Mutation(() => GrowthRecordTypeClass)
  updateLivestockGrowthRecord(
    @Context() context,
    @Args("growthRecordId") growthRecordId: number,
    @Args("growthRecord", {
      type: () => UpdateGrowthRecordInput!,
      nullable: false,
    })
    growthRecord: UpdateGrowthRecordInput,
  ) {
    const { email, role } = context.req.user;

    return this.farmService.updateLivestockGrowthRecord({
      email,
      growthRecordId,
      growthRecord,
      role,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin", "worker")
  @Mutation(() => ExpenseRecordType)
  addLivestockExpenseRecord(
    @Context() context,
    @Args("livestockTag") livestockTag: string,
    @Args("expenseRecord", { type: () => ExpenseRecordInput!, nullable: false })
    expenseRecord: ExpenseRecordInput,
  ) {
    const { email, role } = context.req.user;

    return this.farmService.addLivestockExpenseRecord({
      email,
      livestockTag,
      expenseRecord,
      role,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin", "worker")
  @Mutation(() => ExpenseRecordType)
  updateLivestockExpenseRecord(
    @Context() context,
    @Args("expenseRecordId") expenseRecordId: number,
    @Args("expenseRecord", {
      type: () => UpdateExpenseRecordInput!,
      nullable: false,
    })
    expenseRecord: UpdateExpenseRecordInput,
  ) {
    const { email, role } = context.req.user;

    return this.farmService.updateLivestockExpenseRecord({
      email,
      expenseRecordId,
      expenseRecord,
      role,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin", "worker")
  @Mutation(() => SalesRecordType)
  addLivestockSalesRecord(
    @Context() context,
    @Args("livestockTag") livestockTag: string,
    @Args("salesRecord", { type: () => SalesRecordInput!, nullable: false })
    salesRecord: SalesRecordInput,
  ) {
    const { email, role } = context.req.user;

    return this.farmService.addLivestockSalesRecord({
      email,
      livestockTag,
      salesRecord,
      role,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin", "worker")
  @Mutation(() => SalesRecordType)
  updateLivestockSalesRecord(
    @Context() context,
    @Args("salesRecordId") salesRecordId: number,
    @Args("salesRecord", {
      type: () => UpdateSalesRecordInput!,
      nullable: false,
    })
    salesRecord: UpdateSalesRecordInput,
  ) {
    const { email, role } = context.req.user;

    return this.farmService.updateLivestockSalesRecord({
      email,
      salesRecordId,
      salesRecord,
      role,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Mutation(() => ReviewType)
  addWorkerReview(
    @Context() context,
    @Args("workerTag") workerTag: string,
    @Args("review", {
      type: () => ReviewInput!,
      nullable: false,
    })
    review: ReviewInput,
  ) {
    const { email } = context.req.user;

    return this.farmService.addWorkerReview({
      email,
      workerTag,
      review,
    });
  }
}
