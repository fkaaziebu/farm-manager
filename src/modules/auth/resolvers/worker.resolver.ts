import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { WorkerService } from "../services/worker.service";
import {
  RequestResetResponse,
  ResetResponse,
  WorkerAuthResponse,
} from "../types";

@Resolver()
export class WorkerResolver {
  constructor(private readonly workerService: WorkerService) {}

  @Mutation(() => WorkerAuthResponse)
  async loginWorker(
    @Args("email") email: string,
    @Args("password") password: string,
  ) {
    return this.workerService.loginWorker({
      email,
      password,
    });
  }

  @Mutation(() => WorkerAuthResponse)
  async loginWorkerWithOTP(
    @Args("email") email: string,
    @Args("otpCode") otpCode: string,
  ) {
    return this.workerService.loginWorkerWithOTP({
      email,
      otpCode,
    });
  }

  @Mutation(() => RequestResetResponse)
  async requestWorkerLoginWithOTP(@Args("email") email: string) {
    return this.workerService.requestWorkerLoginWithOTP({
      email,
    });
  }

  @Mutation(() => RequestResetResponse)
  async requestWorkerPasswordReset(@Args("email") email: string) {
    return this.workerService.requestWorkerPasswordReset({
      email,
    });
  }

  @Mutation(() => ResetResponse)
  async resetWorkerPassword(
    @Args("email") email: string,
    @Args("password") password: string,
    @Args("resetCode") resetCode: string,
  ) {
    return this.workerService.resetWorkerPassword({
      email,
      password,
      resetCode,
    });
  }
}
