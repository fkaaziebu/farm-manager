import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";

// Services
import { AuthService } from "./auth.service";

// Guards
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { Roles } from "./guards/roles.decorator";

// Dto's
import { CreateAdminBodyDto } from "./dto/create-admin-body.dto";
import { LoginBodyDto } from "./dto/login-body.dto";
import { PasswordRequestResetBodyDto } from "./dto/password-request-reset-body.dto";
import { PasswordResetQueryDto } from "./dto/password-reset-query.dto";
import { PasswordResetBodyDto } from "./dto/password-reset-body.dto";
import { CreateWorkersBodyDto } from "./dto/create-workers-body.dto";

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
    return this.authService.loginAdmin(loginBodyDto);
  }

  @Post("/auth/workers/login")
  @HttpCode(HttpStatus.OK)
  loginWorker(@Body() loginBodyDto: LoginBodyDto) {
    return this.authService.loginWorker(loginBodyDto);
  }

  @Post("/auth/admins/request-password-reset")
  @HttpCode(HttpStatus.OK)
  requestAdminPasswordReset(
    @Body() passwordResetBodyDto: PasswordRequestResetBodyDto,
  ) {
    return this.authService.requestWorkerPasswordReset(passwordResetBodyDto);
  }

  @Post("/auth/workers/request-password-reset")
  @HttpCode(HttpStatus.OK)
  requestWorkerPasswordReset(
    @Body() passwordResetBodyDto: PasswordRequestResetBodyDto,
  ) {
    return this.authService.requestWorkerPasswordReset(passwordResetBodyDto);
  }

  @Patch("/auth/admins/reset-password")
  resetAdminPassword(
    @Query() resetQueryDto: PasswordResetQueryDto,
    @Body() passwordResetBodyDto: PasswordResetBodyDto,
  ) {
    return this.authService.resetAdminPassword({
      ...resetQueryDto,
      ...passwordResetBodyDto,
    });
  }

  @Patch("/auth/workers/reset-password")
  resetWorkerPassword(
    @Query() resetQueryDto: PasswordResetQueryDto,
    @Body() passwordResetBodyDto: PasswordResetBodyDto,
  ) {
    return this.authService.resetWorkerPassword({
      ...resetQueryDto,
      ...passwordResetBodyDto,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Roles("admin")
  @Post("/auth/workers:add")
  createWorkers(
    @Req() req,
    @Body() createWorkersBodyDto: CreateWorkersBodyDto,
  ) {
    const { email } = req.user;

    return this.authService.createWorkers(email, createWorkersBodyDto.workers);
  }
}
