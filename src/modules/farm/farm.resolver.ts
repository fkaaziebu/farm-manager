import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { FarmType, FarmTypeClass } from "src/database/types/farm.type";
import { FarmService } from "./farm.service";
import { UseGuards } from "@nestjs/common";
import { GqlJwtAuthGuard } from "./guards/gql-jwt-auth.guard";
import { RolesGuard } from "./guards/roles.guard";
import { Roles } from "./decorators/roles.decorator";
import {
  BarnInput,
  BarnSortInput,
  BreedingRecordInput,
  ExpenseRecordInput,
  FarmSortInput,
  GrowthRecordInput,
  HealthRecordInput,
  LivestockInput,
  LivestockSortInput,
  PaginationInput,
  PenInput,
  PenSortInput,
  SalesRecordInput,
  TaskInput,
  UpdateBarnInput,
  UpdateBreedingRecordInput,
  UpdateExpenseRecordInput,
  UpdateGrowthRecordInput,
  UpdateHealthRecordInput,
  UpdateLivestockInput,
  UpdatePenInput,
  UpdateSalesRecordInput,
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
  TaskType,
} from "src/database/types";
import { LivestockUnavailabilityReason } from "src/database/types/livestock.type";
import { Barn } from "src/database/entities";
import {
  BarnConnection,
  FarmConnection,
  LivestockConnection,
  PenConnection,
} from "./types";

@Resolver()
export class FarmResolver {
  constructor(private readonly farmService: FarmService) {}

  // Queries
  @UseGuards(GqlJwtAuthGuard)
  @Query(() => FarmConnection)
  listFarms(
    @Context() context,
    @Args("searchTerm") searchTerm: string,
    @Args("pagination", { nullable: true }) pagination?: PaginationInput,
    @Args("sort", { type: () => [FarmSortInput], nullable: true })
    sort?: FarmSortInput[],
  ) {
    const { email } = context.req.user;
    return this.farmService.listFarmsPaginated({
      email,
      searchTerm,
      pagination,
      sort,
    });
  }

  @UseGuards(GqlJwtAuthGuard)
  @Query(() => BarnConnection)
  listBarns(
    @Context() context,
    @Args("searchTerm") searchTerm: string,
    @Args("pagination", { nullable: true }) pagination?: PaginationInput,
    @Args("sort", { type: () => [BarnSortInput], nullable: true })
    sort?: BarnSortInput[],
  ) {
    const { email } = context.req.user;
    return this.farmService.listBarnsPaginated({
      email,
      searchTerm,
      pagination,
      sort,
    });
  }

  @UseGuards(GqlJwtAuthGuard)
  @Query(() => BarnType)
  getBarn(@Context() context, @Args("barnUnitId") barnUnitId: string) {
    const { email } = context.req.user;
    return this.farmService.getBarn({
      email,
      barnUnitId,
    });
  }

  @UseGuards(GqlJwtAuthGuard)
  @Query(() => PenConnection)
  listPens(
    @Context() context,
    @Args("searchTerm") searchTerm: string,
    @Args("pagination", { nullable: true }) pagination?: PaginationInput,
    @Args("sort", { type: () => [PenSortInput], nullable: true })
    sort?: PenSortInput[],
  ) {
    const { email } = context.req.user;
    return this.farmService.listPensPaginated({
      email,
      searchTerm,
      pagination,
      sort,
    });
  }

  @UseGuards(GqlJwtAuthGuard)
  @Query(() => PenType)
  getPen(@Context() context, @Args("penUnitId") penUnitId: string) {
    const { email } = context.req.user;
    return this.farmService.getPen({
      email,
      penUnitId,
    });
  }

  @UseGuards(GqlJwtAuthGuard)
  @Query(() => LivestockConnection)
  listLivestock(
    @Context() context,
    @Args("searchTerm") searchTerm: string,
    @Args("pagination", { nullable: true }) pagination?: PaginationInput,
    @Args("sort", { type: () => [LivestockSortInput], nullable: true })
    sort?: LivestockSortInput[],
  ) {
    const { email } = context.req.user;
    return this.farmService.listLivestockPaginated({
      email,
      searchTerm,
      pagination,
      sort,
    });
  }

  @UseGuards(GqlJwtAuthGuard)
  @Query(() => LivestockTypeClass)
  getLivestock(@Context() context, @Args("livestockTag") livestockTag: string) {
    const { email } = context.req.user;
    return this.farmService.getLivestock({
      email,
      livestockTag,
    });
  }

  // Mutations
  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => FarmTypeClass)
  createFarm(
    @Context() context,
    @Args("name") name: string,
    @Args("location") location: string,
    @Args("area") area: string,
    @Args("farmType", { type: () => FarmType }) farmType: FarmType,
  ) {
    const { email } = context.req.user;
    return this.farmService.createFarm({
      email,
      name,
      location,
      area,
      farmType,
    });
  }

  @UseGuards(GqlJwtAuthGuard)
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

  @UseGuards(GqlJwtAuthGuard)
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

  @UseGuards(GqlJwtAuthGuard)
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

  @UseGuards(GqlJwtAuthGuard)
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

  @UseGuards(GqlJwtAuthGuard)
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

  @UseGuards(GqlJwtAuthGuard)
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

  @UseGuards(GqlJwtAuthGuard)
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

  @UseGuards(GqlJwtAuthGuard)
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

  @UseGuards(GqlJwtAuthGuard)
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
  @Roles("admin")
  @Mutation(() => LivestockTypeClass)
  markLivestockAsUnavailable(
    @Context() context,
    @Args("livestockTag") livestockTag: string,
    @Args("unavailabilityReason", {
      type: () => LivestockUnavailabilityReason,
      nullable: false,
    })
    unavailabilityReason: LivestockUnavailabilityReason,
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

  @UseGuards(GqlJwtAuthGuard)
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
    const { email } = context.req.user;

    return this.farmService.addLivestockBreedingRecord({
      email,
      maleLivestockTag,
      femaleLivestockTag,
      breedingRecord,
    });
  }

  @UseGuards(GqlJwtAuthGuard)
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
    const { email } = context.req.user;

    return this.farmService.updateLivestockBreedingRecord({
      email,
      breedingRecordId,
      breedingRecord,
    });
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => HealthRecordTypeClass)
  addLivestockHealthRecord(
    @Context() context,
    @Args("livestockTag") livestockTag: string,
    @Args("healthRecord", { type: () => HealthRecordInput!, nullable: false })
    healthRecord: HealthRecordInput,
  ) {
    const { email } = context.req.user;

    return this.farmService.addLivestockHealthRecord({
      email,
      livestockTag,
      healthRecord,
    });
  }

  @UseGuards(GqlJwtAuthGuard)
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
    const { email } = context.req.user;

    return this.farmService.updateLivestockHealthRecord({
      email,
      healthRecordId,
      healthRecord,
    });
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => GrowthRecordTypeClass)
  addLivestockGrowthRecord(
    @Context() context,
    @Args("livestockTag") livestockTag: string,
    @Args("growthRecord", { type: () => GrowthRecordInput!, nullable: false })
    growthRecord: GrowthRecordInput,
  ) {
    const { email } = context.req.user;

    return this.farmService.addLivestockGrowthRecord({
      email,
      livestockTag,
      growthRecord,
    });
  }

  @UseGuards(GqlJwtAuthGuard)
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
    const { email } = context.req.user;

    return this.farmService.updateLivestockGrowthRecord({
      email,
      growthRecordId,
      growthRecord,
    });
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => ExpenseRecordType)
  addLivestockExpenseRecord(
    @Context() context,
    @Args("livestockTag") livestockTag: string,
    @Args("expenseRecord", { type: () => ExpenseRecordInput!, nullable: false })
    expenseRecord: ExpenseRecordInput,
  ) {
    const { email } = context.req.user;

    return this.farmService.addLivestockExpenseRecord({
      email,
      livestockTag,
      expenseRecord,
    });
  }

  @UseGuards(GqlJwtAuthGuard)
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
    const { email } = context.req.user;

    return this.farmService.updateLivestockExpenseRecord({
      email,
      expenseRecordId,
      expenseRecord,
    });
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => SalesRecordType)
  addLivestockSalesRecord(
    @Context() context,
    @Args("livestockTag") livestockTag: string,
    @Args("salesRecord", { type: () => SalesRecordInput!, nullable: false })
    salesRecord: SalesRecordInput,
  ) {
    const { email } = context.req.user;

    return this.farmService.addLivestockSalesRecord({
      email,
      livestockTag,
      salesRecord,
    });
  }

  @UseGuards(GqlJwtAuthGuard)
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
    const { email } = context.req.user;

    return this.farmService.updateLivestockSalesRecord({
      email,
      salesRecordId,
      salesRecord,
    });
  }
}
