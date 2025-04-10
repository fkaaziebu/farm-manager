import { AuthService } from "./auth.service";
import { CreateAdminBodyDto } from "./dto/create-admin-body.dto";
import { LoginBodyDto } from "./dto/login-body.dto";
import { PasswordRequestResetBodyDto } from "./dto/password-request-reset-body.dto";
import { PasswordResetQueryDto } from "./dto/password-reset-query.dto";
import { PasswordResetBodyDto } from "./dto/password-reset-body.dto";
import { CreateWorkersBodyDto } from "./dto/create-workers-body.dto";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    createAdminAccount(createAdminBodyDto: CreateAdminBodyDto): Promise<any>;
    loginAdmin(loginBodyDto: LoginBodyDto): Promise<any>;
    loginWorker(loginBodyDto: LoginBodyDto): Promise<any>;
    requestAdminPasswordReset(passwordResetBodyDto: PasswordRequestResetBodyDto): Promise<any>;
    requestWorkerPasswordReset(passwordResetBodyDto: PasswordRequestResetBodyDto): Promise<any>;
    resetAdminPassword(resetQueryDto: PasswordResetQueryDto, passwordResetBodyDto: PasswordResetBodyDto): Promise<any>;
    resetWorkerPassword(resetQueryDto: PasswordResetQueryDto, passwordResetBodyDto: PasswordResetBodyDto): Promise<any>;
    createWorkers(req: any, createWorkersBodyDto: CreateWorkersBodyDto): Promise<{
        message: string;
    }>;
}
