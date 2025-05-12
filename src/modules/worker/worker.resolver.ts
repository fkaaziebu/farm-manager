import { UseGuards } from "@nestjs/common";
import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GqlJwtAuthGuard } from "./guards/gql-jwt-auth.guard";
import { ReportType } from "src/database/types";
import { ReportConnection } from "./types";
import {
  CoordinatesInput,
  ReportFilterInput,
  ReportSortInput,
  UpdateReportInput,
} from "./inputs";
import { PaginationInput } from "src/database/inputs";
import { WorkerService } from "./worker.service";

@Resolver()
export class WorkerResolver {
  constructor(private readonly workerService: WorkerService) {}

  // Mutations
  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => ReportType)
  createReport(@Context() context, @Args("farmTag") farmTag: string) {
    const { email } = context.req.user;
    return { email, farmTag };
  }

  @UseGuards(GqlJwtAuthGuard)
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

  @UseGuards(GqlJwtAuthGuard)
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

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => ReportType)
  completeReport(@Context() context, @Args("reportTag") reportTag: string) {
    const { email } = context.req.user;
    return this.workerService.completeReport({
      email,
      reportTag,
    });
  }

  // Queries
  @UseGuards(GqlJwtAuthGuard)
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

  @UseGuards(GqlJwtAuthGuard)
  @Query(() => ReportType)
  getReport(@Context() context, @Args("reportTag") reportTag: string) {
    const { email } = context.req.user;
    return this.workerService.getReport({ email, reportTag });
  }

  @UseGuards(GqlJwtAuthGuard)
  @Query(() => ReportType)
  getQrCode(@Context() context, @Args("farmTag") farmTag: string) {
    const { email } = context.req.user;
    return this.workerService.getQrCode({
      email,
      farmTag,
    });
  }
}
