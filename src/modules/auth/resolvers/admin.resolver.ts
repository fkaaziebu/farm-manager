import { UseGuards } from "@nestjs/common";
import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";
import { PaginationInput } from "src/database/inputs";
import { AdminType, IamType } from "src/database/types";
import { Roles } from "../decorators/roles.decorator";
import { GqlJwtAuthGuard } from "../guards/gql-jwt-auth.guard";
import { RolesGuard } from "../guards/roles.guard";
import { IamUserInput } from "../inputs";
import { AdminService } from "../services/admin.service";
import {
  AdminAuthResponse,
  RequestResetResponse,
  ResetResponse,
} from "../types";
import { IamConnection } from "../types/iam-connection.type";

@Resolver()
export class AdminResolver {
  constructor(private readonly adminService: AdminService) {}

  // Queries
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Mutation(() => IamConnection)
  async listIAMUsers(
    @Context() context,
    @Args("searchTerm", { nullable: true }) searchTerm: string,
    @Args("pagination", { nullable: true }) pagination?: PaginationInput,
  ) {
    const { email } = context.req.user;
    return this.adminService.listIAMUsersPaginated({
      email,
      searchTerm,
      pagination,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Mutation(() => IamType)
  async getIAMUser(
    @Context() context,
    @Args("iamIdentifier") iamIdentifier: string,
  ) {
    const { email } = context.req.user;
    return this.adminService.getIamUser({
      email,
      iamIdentifier,
    });
  }

  // Mutations
  @Mutation(() => AdminType)
  async registerAdmin(
    @Args("name") name: string,
    @Args("email") email: string,
    @Args("password") password: string,
  ) {
    return this.adminService.registerAdmin({
      name,
      email,
      password,
    });
  }

  @Mutation(() => AdminAuthResponse)
  async loginAdmin(
    @Args("email") email: string,
    @Args("password") password: string,
  ) {
    return this.adminService.loginAdmin({
      email,
      password,
    });
  }

  @Mutation(() => AdminAuthResponse)
  async loginAdminWithOTP(
    @Args("email") email: string,
    @Args("otpCode") otpCode: string,
  ) {
    return this.adminService.loginAdminWithOTP({
      email,
      otpCode,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Mutation(() => AdminType)
  async createIAMUsers(
    @Context() context,
    @Args("iamUsers", { type: () => [IamUserInput!]!, nullable: false })
    iamUsers: IamUserInput[],
  ) {
    const { email } = context.req.user;
    return this.adminService.createIAMUsers({
      email,
      iamUsers,
    });
  }

  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles("admin")
  @Mutation(() => IamType)
  async updateIAMUser(
    @Context() context,
    @Args("iamIdentifier") iamIdentifier: string,
    @Args("name", { nullable: true }) name: string,
    @Args("password", { nullable: true }) password: string,
  ) {
    const { email } = context.req.user;
    return this.adminService.updateIAMUser({
      email,
      iamIdentifier,
      name,
      password,
    });
  }

  @Mutation(() => AdminAuthResponse)
  async loginIAMUser(
    @Args("iamIdentifier") iamIdentifier: string,
    @Args("password") password: string,
  ) {
    return this.adminService.loginIAMUser({
      iamIdentifier,
      password,
    });
  }

  @Mutation(() => RequestResetResponse)
  async requestAdminLoginWithOTP(@Args("email") email: string) {
    return this.adminService.requestAdminLoginWithOTP({
      email,
    });
  }

  @Mutation(() => RequestResetResponse)
  async requestAdminPasswordReset(@Args("email") email: string) {
    return this.adminService.requestAdminPasswordReset({
      email,
    });
  }

  @Mutation(() => ResetResponse)
  async resetAdminPassword(
    @Args("email") email: string,
    @Args("password") password: string,
    @Args("resetCode") resetCode: string,
  ) {
    return this.adminService.resetAdminPassword({
      email,
      password,
      resetCode,
    });
  }
}
