import { UseGuards } from "@nestjs/common";
import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GqlJwtAuthGuard } from "./guards/gql-jwt-auth.guard";
import { ReportType } from "src/database/types";
import { QrCodeResponse, ReportConnection } from "./types";
import {
  CoordinatesInput,
  ReportFilterInput,
  ReportSortInput,
  UpdateReportInput,
} from "./inputs";
import { PaginationInput } from "src/database/inputs";
import { WorkerService } from "./worker.service";
import { Roles } from "./decorators/roles.decorator";
import { RolesGuard } from "./guards/roles.guard";

@Resolver()
export class WorkerResolver {
  constructor(private readonly workerService: WorkerService) {}

  // Mutations
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("worker")
  @Mutation(() => ReportType)
  createReport(@Context() context, @Args("farmTag") farmTag: string) {
    const { email } = context.req.user;
    return this.workerService.createReport({
      email,
      farmTag,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("worker")
  @Mutation(() => ReportType)
  verifyReport(
    @Context() context,
    @Args("reportTag") reportTag: string,
    @Args("verificationCode") verificationCode: string,
    @Args("coordinate", { type: () => CoordinatesInput, nullable: false })
    coordinate: CoordinatesInput,
  ) {
    const { email } = context.req.user;
    return this.workerService.verifyReport({
      email,
      reportTag,
      verificationCode,
      coordinate,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("worker")
  @Mutation(() => ReportType)
  updateReport(
    @Context() context,
    @Args("reportTag") reportTag: string,
    @Args("reportData", { type: () => UpdateReportInput, nullable: false })
    reportData: UpdateReportInput,
  ) {
    const { email } = context.req.user;
    return { email, reportTag };
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("worker")
  @Mutation(() => ReportType)
  completeReport(@Context() context, @Args("reportTag") reportTag: string) {
    const { email } = context.req.user;
    return this.workerService.completeReport({
      email,
      reportTag,
    });
  }

  // Queries
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("worker")
  @Query(() => ReportConnection)
  listReports(
    @Context() context,
    @Args("filter", { nullable: true }) filter?: ReportFilterInput,
    @Args("pagination", { nullable: true }) pagination?: PaginationInput,
    @Args("sort", { type: () => [ReportSortInput], nullable: true })
    sort?: ReportSortInput[],
  ) {
    const { email } = context.req.user;
    return this.workerService.listReportsPaginated({
      email,
      filter,
      pagination,
      sort,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("worker")
  @Query(() => ReportType)
  getReport(@Context() context, @Args("reportTag") reportTag: string) {
    const { email } = context.req.user;
    return this.workerService.getReport({ email, reportTag });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("worker")
  @Query(() => QrCodeResponse)
  getQrCode(@Context() context, @Args("farmTag") farmTag: string) {
    const { email } = context.req.user;
    return this.workerService.getQrCode({
      email,
      farmTag,
    });
  }
}
