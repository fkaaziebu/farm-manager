import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { FarmType } from "src/types/farm.type";
import { FarmService } from "./farm.service";
import { UseGuards } from "@nestjs/common";
import { GqlJwtAuthGuard } from "./guards/gql-jwt-auth.guard";
import { PaginationInput } from "./pagination/pagination.type";
import { FarmSortInput } from "./inputs/farm-sort.input";
import {
  AnimalFilterInput,
  FarmFilterInput,
  HouseFilterInput,
  WorkerFilterInput,
} from "./inputs/farm-filters.input";
import { FarmConnection } from "src/types/farm-connection.type";
import { WorkerType } from "src/types/worker.type";
import { WorkerSortInput } from "./inputs/worker-sort.input";
import { Farm } from "src/entities/farm.entity";
import { AnimalSortInput } from "./inputs/animal-sort.input";
import { AnimalType } from "src/types/animal.type";
import { HouseType } from "src/types/house.type";
import { HouseSortInput } from "./inputs/house-sort.input";
import type { WorkerRole } from "src/entities/worker.entity";
import { WorkerIdInput } from "./inputs/worker-id.input";
import { CreateWorkerInput } from "./inputs/create-worker.input";
import { CreateAnimalInput } from "./inputs/create-animal.input";
import { CreateRoomInput } from "./inputs/create-room.input";
import { BreedingRecordType } from "src/types/breeding_record.type";
import { GrowthPeriod } from "src/entities/growth_record.entity";
import { ExpenseCategory } from "src/entities/expense_record.entity";
import { SalesRecordType } from "src/types/sales_record.type";
import { ExpenseRecordType } from "src/types/expense_record.type";
import { GrowthRecordType } from "src/types/growth_record.type";
import { HealthRecordType } from "src/types/health_record.type";

@Resolver(() => FarmType)
export class FarmResolver {
  constructor(private readonly farmService: FarmService) {}

  @UseGuards(GqlJwtAuthGuard)
  @Query(() => FarmConnection)
  listFarms(
    @Context() context,
    @Args("filter", { nullable: true }) filter?: FarmFilterInput,
    @Args("searchTerm", { nullable: true }) searchTerm?: string,
    @Args("pagination", { nullable: true }) pagination?: PaginationInput,
    @Args("sort", { type: () => [FarmSortInput], nullable: true })
    sort?: FarmSortInput[],
  ) {
    const { email, role } = context.req.user;

    return this.farmService.listFarmsPaginated({
      email,
      role,
      filter,
      searchTerm,
      pagination: pagination || {},
      sort,
    });
  }

  @ResolveField("workers", () => [WorkerType])
  async getWorkers(
    @Parent() farm: Farm,
    @Args("filter", { nullable: true }) filter?: WorkerFilterInput,
    @Args("pagination", { nullable: true }) pagination?: PaginationInput,
    @Args("sort", { type: () => [WorkerSortInput], nullable: true })
    sort?: WorkerSortInput[],
  ) {
    if (!filter && !pagination && !sort) {
      return farm.workers || [];
    }

    // return this.farmService.getWorkersForFarm(farm.id, { filter, pagination, sort });
  }

  @ResolveField("animals", () => [AnimalType])
  async getAnimals(
    @Parent() farm: Farm,
    @Args("filter", { nullable: true }) filter?: AnimalFilterInput,
    @Args("pagination", { nullable: true }) pagination?: PaginationInput,
    @Args("sort", { type: () => [AnimalSortInput], nullable: true })
    sort?: AnimalSortInput[],
  ) {
    if (!filter && !pagination && !sort) {
      return farm.animals || [];
    }

    // return this.farmService.getAnimalsForFarm(farm.id, { filter, pagination, sort });
  }

  @ResolveField("houses", () => [HouseType])
  async getHouses(
    @Parent() farm: Farm,
    @Args("filter", { nullable: true }) filter?: HouseFilterInput,
    @Args("pagination", { nullable: true }) pagination?: PaginationInput,
    @Args("sort", { type: () => [HouseSortInput], nullable: true })
    sort?: HouseSortInput[],
  ) {
    // If no special args, return the existing houses
    if (!filter && !pagination && !sort) {
      return farm.houses || [];
    }

    // return this.farmService.getHousesForFarm(farm.id, { filter, pagination, sort });
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => FarmType)
  createFarm(
    @Context() context,
    @Args("name") name: string,
    @Args("location") location: string,
    @Args("area") area: string,
  ) {
    const { email } = context.req.user;
    return this.farmService.createFarm({ name, location, area, email });
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => WorkerType)
  addWorkersToFarm(
    @Context() context,
    @Args("farmId") farmId: string,
    @Args("workerIds", { type: () => [WorkerIdInput], nullable: false })
    workerIds?: WorkerIdInput[],
  ) {
    const { email } = context.req.user;
    return this.farmService.addFarmWorkers({ farmId, workerIds, email });
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => WorkerType)
  async createAndAddWorkerToFarm(
    @Context() context,
    @Args("farmId") farmId: string,
    @Args("workers", { type: () => [CreateWorkerInput], nullable: false })
    workers?: CreateWorkerInput[],
  ) {
    const { email } = context.req.user;

    const createdWorkers = await this.farmService.createWorkers({
      email,
      workers,
    });

    return this.farmService.addFarmWorkers({
      farmId,
      workerIds: createdWorkers.workerIds,
      email,
    });
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => HouseType)
  addHouseToFarm(
    @Context() context,
    @Args("farmId") farmId: string,
    @Args("houseNumber") houseNumber: string,
    @Args("rooms", { type: () => [CreateRoomInput], nullable: false })
    rooms: CreateRoomInput[],
  ) {
    const { email } = context.req.user;
    return this.farmService.addHouseToFarm({
      farmId,
      houseNumber,
      rooms,
      email,
    });
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => FarmType)
  addAnimalsToFarm(
    @Context() context,
    @Args("farmId") farmId: string,
    @Args("houseNumber") houseNumber: string,
    @Args("roomNumber") roomNumber: string,
    @Args("animals", { type: () => [CreateAnimalInput], nullable: false })
    animals: CreateAnimalInput[],
  ) {
    const { email } = context.req.user;
    return this.farmService.addAnimalsToRoom({
      farmId,
      houseNumber,
      roomNumber,
      animals,
      email,
    });
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => BreedingRecordType)
  addAnimalBreedingRecord(
    @Context() context,
    @Args("maleTagNumber") maleTagNumber: string,
    @Args("femaleTagNumber") femaleTagNumber: string,
    @Args("matingDate") matingDate: Date,
    @Args("expectedDelivery") expectedDelivery: Date,
  ) {
    const { email, role } = context.req.user;
    return this.farmService.addAnimalBreedingRecord({
      email,
      role,
      maleTagNumber,
      femaleTagNumber,
      matingDate,
      expectedDelivery,
    });
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => HealthRecordType)
  addAnimalHealthRecord(
    @Context() context,
    @Args("tagNumber") tagNumber: string,
    @Args("issue") issue: string,
    @Args("symptoms") symptoms: string,
    @Args("diagnosis") diagnosis: string,
    @Args("medication") medication: string,
    @Args("vet_name") vet_name: string,
    @Args("cost") cost: number,
    @Args("notes") notes: string,
  ) {
    const { email, role } = context.req.user;
    return this.farmService.addAnimalHealthRecord({
      email,
      role,
      tagNumber,
      issue,
      symptoms,
      diagnosis,
      medication,
      vet_name,
      cost,
      notes,
    });
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => GrowthRecordType)
  addAnimalGrowthRecord(
    @Context() context,
    @Args("tagNumber") tagNumber: string,
    @Args("period") period: GrowthPeriod,
    @Args("growthRate") growthRate: number,
    @Args("notes") notes: string,
  ) {
    const { email, role } = context.req.user;
    return this.farmService.addAnimalGrowthRecord({
      email,
      role,
      tagNumber,
      period,
      growthRate,
      notes,
    });
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => ExpenseRecordType)
  addAnimalExpenseRecord(
    @Context() context,
    @Args("tagNumber") tagNumber: string,
    @Args("category") category: ExpenseCategory,
    @Args("expenseDate") expenseDate: Date,
    @Args("amount") amount: number,
    @Args("notes") notes: string,
  ) {
    const { email, role } = context.req.user;
    return this.farmService.addAnimalExpenseRecord({
      email,
      role,
      tagNumber,
      category,
      expenseDate,
      amount,
      notes,
    });
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => SalesRecordType)
  addAnimalSalesRecord(
    @Context() context,
    @Args("tagNumber") tagNumber: string,
    @Args("buyerName") buyerName: string,
    @Args("saleDate") saleDate: Date,
    @Args("priceSold") priceSold: number,
    @Args("notes") notes: string,
  ) {
    const { email, role } = context.req.user;
    return this.farmService.addAnimalSalesRecord({
      email,
      role,
      tagNumber,
      buyerName,
      saleDate,
      priceSold,
      notes,
    });
  }
}
