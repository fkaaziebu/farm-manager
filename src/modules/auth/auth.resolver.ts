import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { AdminType } from "src/database/types";
import {
  AdminAuthResponse,
  RequestResetResponse,
  ResetResponse,
  WorkerAuthResponse,
} from "./types";

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AdminType)
  async registerAdmin(
    @Args("name") name: string,
    @Args("email") email: string,
    @Args("password") password: string,
  ) {
    return this.authService.registerAdmin({
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
    return this.authService.loginAdmin({
      email,
      password,
    });
  }

  @Mutation(() => WorkerAuthResponse)
  async loginWorker(
    @Args("email") email: string,
    @Args("password") password: string,
  ) {
    return this.authService.loginWorker({
      email,
      password,
    });
  }

  @Mutation(() => RequestResetResponse)
  async requestAdminPasswordReset(@Args("email") email: string) {
    return this.authService.requestAdminPasswordReset({
      email,
    });
  }

  @Mutation(() => RequestResetResponse)
  async requestWorkerPasswordReset(@Args("email") email: string) {
    return this.authService.requestWorkerPasswordReset({
      email,
    });
  }

  @Mutation(() => ResetResponse)
  async resetAdminPassword(
    @Args("email") email: string,
    @Args("password") password: string,
    @Args("resetCode") resetCode: string,
  ) {
    return this.authService.resetAdminPassword({
      email,
      password,
      resetCode,
    });
  }

  @Mutation(() => ResetResponse)
  async resetWorkerPassword(
    @Args("email") email: string,
    @Args("password") password: string,
    @Args("resetCode") resetCode: string,
  ) {
    return this.authService.resetWorkerPassword({
      email,
      password,
      resetCode,
    });
  }
}
