import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { AdminType } from "src/types/admin.type";
import { WorkerType } from "src/types/worker.type";

@Resolver(() => AdminType)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AdminType)
  async registerAdmin(
    @Args("name") name: string,
    @Args("email") email: string,
    @Args("password") password: string,
  ) {
    return this.authService.createAdmin({
      name,
      email,
      password,
    });
  }

  @Mutation(() => AdminType)
  async loginAdmin(
    @Args("email") email: string,
    @Args("password") password: string,
  ) {
    return this.authService.loginAdmin({
      email,
      password,
    });
  }

  @Mutation(() => WorkerType)
  async loginWorker(
    @Args("email") email: string,
    @Args("password") password: string,
  ) {
    return this.authService.loginWorker({
      email,
      password,
    });
  }

  @Mutation(() => AdminType)
  async requestAdminPasswordReset(@Args("email") email: string) {
    return this.authService.requestAdminPasswordReset({
      email,
    });
  }

  @Mutation(() => WorkerType)
  async requestWorkerPasswordReset(@Args("email") email: string) {
    return this.authService.requestWorkerPasswordReset({
      email,
    });
  }

  @Mutation(() => AdminType)
  async resetAdminPassword(
    @Args("email") email: string,
    @Args("resetToken") resetToken: string,
    @Args("password") password: string,
  ) {
    return this.authService.resetAdminPassword({
      email,
      resetCode: resetToken,
      password,
    });
  }

  @Mutation(() => WorkerType)
  async resetWorkerPassword(
    @Args("email") email: string,
    @Args("resetToken") resetToken: string,
    @Args("password") password: string,
  ) {
    return this.authService.resetWorkerPassword({
      email,
      resetCode: resetToken,
      password,
    });
  }
}
