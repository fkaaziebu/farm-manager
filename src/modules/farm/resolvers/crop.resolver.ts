import { UseGuards } from "@nestjs/common";
import {
  Args,
  Context,
  Mutation,
  Query,
  registerEnumType,
  Resolver,
} from "@nestjs/graphql";
import { GqlJwtAuthGuard } from "../guards/gql-jwt-auth.guard";
import { RolesGuard } from "../guards/roles.guard";
import { Roles } from "../decorators/roles.decorator";
import {
  CropBatchType,
  ExpenseRecordType,
  FarmTypeClass,
  FieldType,
  GreenhouseType,
  SalesRecordType,
} from "src/database/types";
import {
  CropBatchFilterInput,
  CropBatchInput,
  CropBatchSortInput,
  ExpenseRecordInput,
  FieldInput,
  FieldSortInput,
  GreenhouseInput,
  GreenhouseSortInput,
  SalesRecordInput,
  UpdateCropBatchInput,
  UpdateExpenseRecordInput,
  UpdateFieldInput,
  UpdateGreenhouseInput,
  UpdateSalesRecordInput,
} from "../inputs";
import { CropService } from "../services/crop.service";
import { WorkerRoles } from "../decorators/worker-roles.decorator";
import { WorkerRole } from "src/database/types/worker.type";
import {
  CropBatchConnection,
  FieldConnection,
  GreenhouseConnection,
} from "../types";
import { PaginationInput } from "src/database/inputs";

enum HousingUnit {
  FIELD = "FIELD",
  GREENHOUSE = "GREENHOUSE",
}

registerEnumType(HousingUnit, {
  name: "HousingUnit",
  description: "Whether it's a field of a greenhouse",
});

@Resolver()
export class CropResolver {
  constructor(private readonly cropService: CropService) {}

  // Mutations
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin", "worker")
  @WorkerRoles(WorkerRole.FARM_MANAGER)
  @Mutation(() => FarmTypeClass)
  addFieldsToFarm(
    @Context() context,
    @Args("farmTag") farmTag: string,
    @Args("fields", { type: () => [FieldInput!]!, nullable: false })
    fields: FieldInput[],
  ) {
    const { email, role } = context.req.user;
    return this.cropService.addFieldsToFarm({ farmTag, email, fields, role });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin", "worker")
  @WorkerRoles(WorkerRole.FARM_MANAGER)
  @Mutation(() => FarmTypeClass)
  addGreenhousesToFarm(
    @Context() context,
    @Args("farmTag") farmTag: string,
    @Args("greenhouses", { type: () => [GreenhouseInput!]!, nullable: false })
    greenhouses: GreenhouseInput[],
  ) {
    const { email, role } = context.req.user;
    return this.cropService.addGreenhousesToFarm({
      farmTag,
      email,
      greenhouses,
      role,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin", "worker")
  @WorkerRoles(WorkerRole.FARM_MANAGER)
  @Mutation(() => FieldType)
  addCropBatchesToField(
    @Context() context,
    @Args("fieldUnitId") fieldUnitId: string,
    @Args("cropBatches", { type: () => [CropBatchInput!]!, nullable: false })
    cropBatches: CropBatchInput[],
  ) {
    const { email, role } = context.req.user;

    return this.cropService.addCropBatchesToField({
      email,
      fieldUnitId,
      cropBatches,
      role,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin", "worker")
  @WorkerRoles(WorkerRole.FARM_MANAGER)
  @Mutation(() => GreenhouseType)
  addCropBatchesToGreenhouse(
    @Context() context,
    @Args("greenhouseUnitId") greenhouseUnitId: string,
    @Args("cropBatches", { type: () => [CropBatchInput!]!, nullable: false })
    cropBatches: CropBatchInput[],
  ) {
    const { email, role } = context.req.user;

    return this.cropService.addCropBatchesToGreenhouse({
      email,
      greenhouseUnitId,
      cropBatches,
      role,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin", "worker")
  @Mutation(() => ExpenseRecordType)
  addCropBatchExpenseRecord(
    @Context() context,
    @Args("cropBatchTag") cropBatchTag: string,
    @Args("expenseRecord", { type: () => ExpenseRecordInput!, nullable: false })
    expenseRecord: ExpenseRecordInput,
  ) {
    const { email, role } = context.req.user;

    return this.cropService.addCropBatchExpenseRecord({
      email,
      cropBatchTag,
      expenseRecord,
      role,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin", "worker")
  @Mutation(() => SalesRecordType)
  addCropBatchSalesRecord(
    @Context() context,
    @Args("cropBatchTag") cropBatchTag: string,
    @Args("salesRecord", { type: () => SalesRecordInput!, nullable: false })
    salesRecord: SalesRecordInput,
  ) {
    const { email, role } = context.req.user;

    return this.cropService.addCropBatchSalesRecord({
      email,
      cropBatchTag,
      salesRecord,
      role,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin", "worker")
  @WorkerRoles(WorkerRole.FARM_MANAGER)
  @Mutation(() => FieldType)
  updateField(
    @Context() context,
    @Args("fieldUnitId") fieldUnitId: string,
    @Args("field", { type: () => UpdateFieldInput, nullable: false })
    field: UpdateFieldInput,
  ) {
    const { email, role } = context.req.user;

    return this.cropService.updateField({
      email,
      fieldUnitId,
      field,
      role,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin", "worker")
  @WorkerRoles(WorkerRole.FARM_MANAGER)
  @Mutation(() => GreenhouseType)
  updateGreenhouse(
    @Context() context,
    @Args("greenhouseUnitId") greenhouseUnitId: string,
    @Args("greenhouse", { type: () => UpdateGreenhouseInput, nullable: false })
    greenhouse: UpdateGreenhouseInput,
  ) {
    const { email, role } = context.req.user;

    return this.cropService.updateGreenhouse({
      email,
      greenhouseUnitId,
      greenhouse,
      role,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin", "worker")
  @Mutation(() => CropBatchType)
  updateCropBatch(
    @Context() context,
    @Args("cropBatchTag") cropBatchTag: string,
    @Args("cropBatch", { type: () => UpdateCropBatchInput, nullable: false })
    cropBatch: UpdateCropBatchInput,
  ) {
    const { email, role } = context.req.user;

    return this.cropService.updateCropBatch({
      email,
      cropBatchTag,
      cropBatch,
      role,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin", "worker")
  @Mutation(() => ExpenseRecordType)
  updateCropBatchExpenseRecord(
    @Context() context,
    @Args("expenseRecordId") expenseRecordId: number,
    @Args("expenseRecord", {
      type: () => UpdateExpenseRecordInput!,
      nullable: false,
    })
    expenseRecord: UpdateExpenseRecordInput,
  ) {
    const { email, role } = context.req.user;

    return this.cropService.updateCropBatchExpenseRecord({
      email,
      expenseRecordId,
      expenseRecord,
      role,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin", "worker")
  @Mutation(() => SalesRecordType)
  updateCropBatchSalesRecord(
    @Context() context,
    @Args("salesRecordId") salesRecordId: number,
    @Args("salesRecord", {
      type: () => UpdateSalesRecordInput!,
      nullable: false,
    })
    salesRecord: UpdateSalesRecordInput,
  ) {
    const { email, role } = context.req.user;

    return this.cropService.updateCropBatchSalesRecord({
      email,
      salesRecordId,
      salesRecord,
      role,
    });
  }

  // Queries
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin", "worker")
  @Query(() => FieldType)
  getField(@Context() context, @Args("fieldUnitId") fieldUnitId: string) {
    const { email, role } = context.req.user;
    return this.cropService.getField({
      email,
      fieldUnitId,
      role,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin", "worker")
  @Query(() => GreenhouseType)
  getGreenhouse(
    @Context() context,
    @Args("greenhouseUnitId") greenhouseUnitId: string,
  ) {
    const { email, role } = context.req.user;
    return this.cropService.getGreenhouse({
      email,
      greenhouseUnitId,
      role,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin", "worker")
  @Query(() => CropBatchType)
  getCropBatch(
    @Context() context,
    @Args("cropBatchTag") cropBatchTag: string,
    @Args("housingUnit", {
      type: () => HousingUnit!,
      nullable: false,
    })
    housingUnit: HousingUnit,
  ) {
    const { email, role } = context.req.user;
    return this.cropService.getCropBatch({
      email,
      cropBatchTag,
      housingUnit,
      role,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin", "worker")
  @Query(() => FieldConnection)
  listFields(
    @Context() context,
    @Args("searchTerm") searchTerm: string,
    @Args("pagination", { nullable: true }) pagination?: PaginationInput,
    @Args("sort", { type: () => [FieldSortInput], nullable: true })
    sort?: FieldSortInput[],
  ) {
    const { email, role } = context.req.user;
    return this.cropService.listFieldsPaginated({
      email,
      searchTerm,
      pagination,
      sort,
      role,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin", "worker")
  @Query(() => GreenhouseConnection)
  listGreenhouses(
    @Context() context,
    @Args("searchTerm") searchTerm: string,
    @Args("pagination", { nullable: true }) pagination?: PaginationInput,
    @Args("sort", { type: () => [GreenhouseSortInput], nullable: true })
    sort?: GreenhouseSortInput[],
  ) {
    const { email, role } = context.req.user;
    return this.cropService.listGreenhousesPaginated({
      email,
      searchTerm,
      pagination,
      sort,
      role,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin", "worker")
  @Query(() => CropBatchConnection)
  listCropBatches(
    @Context() context,
    @Args("searchTerm") searchTerm: string,
    @Args("filter", { nullable: true }) filter?: CropBatchFilterInput,
    @Args("pagination", { nullable: true }) pagination?: PaginationInput,
    @Args("sort", { type: () => [CropBatchSortInput], nullable: true })
    sort?: CropBatchSortInput[],
  ) {
    const { email, role } = context.req.user;
    return this.cropService.listCropBatchesPaginated({
      email,
      searchTerm,
      filter,
      pagination,
      sort,
      role,
    });
  }
}
