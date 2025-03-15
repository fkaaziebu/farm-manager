import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import type { CreateAdminBodyDto } from "./dto/create-admin-body.dto";
import type { LoginBodyDto } from "./dto/login-body.dto";
import type { PasswordRequestResetBodyDto } from "./dto/password-request-reset-body.dto";
import type { PasswordResetQueryDto } from "./dto/password-reset-query.dto";
import type { PasswordResetBodyDto } from "./dto/password-reset-body.dto";
import { AuthService } from "./auth.service";

@Controller("v1")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/auth/admins/register")
  async createAdminAccount(@Body() createAdminBodyDto: CreateAdminBodyDto) {
    return this.authService.createAdmin({
      ...createAdminBodyDto,
    });
  }

  @Post("/auth/admins/login")
  @HttpCode(HttpStatus.OK)
  loginAdmin(@Body() loginBodyDto: LoginBodyDto) {
    return {
      ...loginBodyDto,
    };
  }

  @Post("/auth/workers/login")
  @HttpCode(HttpStatus.OK)
  loginWorker(@Body() loginBodyDto: LoginBodyDto) {
    return {
      ...loginBodyDto,
    };
  }

  @Post("/auth/admins/request-password-reset")
  @HttpCode(HttpStatus.OK)
  requestAdminPasswordReset(
    @Body() passwordResetBodyDto: PasswordRequestResetBodyDto,
  ) {
    return {
      ...passwordResetBodyDto,
    };
  }

  @Post("/auth/workers/request-password-reset")
  @HttpCode(HttpStatus.OK)
  requestWorkerPasswordReset(
    @Body() passwordResetBodyDto: PasswordRequestResetBodyDto,
  ) {
    return {
      ...passwordResetBodyDto,
    };
  }

  @Patch("/auth/admins/reset-password")
  resetAdminPassword(
    @Query() resetQueryDto: PasswordResetQueryDto,
    @Body() passwordResetBodyDto: PasswordResetBodyDto,
  ) {
    return {
      ...resetQueryDto,
      ...passwordResetBodyDto,
    };
  }

  @Patch("/auth/workers/reset-password")
  resetWorkerPassword(
    @Query() resetQueryDto: PasswordResetQueryDto,
    @Body() passwordResetBodyDto: PasswordResetBodyDto,
  ) {
    return {
      ...resetQueryDto,
      ...passwordResetBodyDto,
    };
  }
}
