import type { CreateAdminBodyDto } from "./dto/create-admin-body.dto";
import type { LoginBodyDto } from "./dto/login-body.dto";
import type { PasswordRequestResetBodyDto } from "./dto/password-request-reset-body.dto";
import type { PasswordResetQueryDto } from "./dto/password-reset-query.dto";
import type { PasswordResetBodyDto } from "./dto/password-reset-body.dto";
import { AuthService } from "./auth.service";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    createAdminAccount(createAdminBodyDto: CreateAdminBodyDto): Promise<{
        name: string;
        email: string;
        password: string;
        message: string;
    }>;
    loginAdmin(loginBodyDto: LoginBodyDto): {
        email: string;
        password: string;
    };
    loginWorker(loginBodyDto: LoginBodyDto): {
        email: string;
        password: string;
    };
    requestAdminPasswordReset(passwordResetBodyDto: PasswordRequestResetBodyDto): {
        email: string;
    };
    requestWorkerPasswordReset(passwordResetBodyDto: PasswordRequestResetBodyDto): {
        email: string;
    };
    resetAdminPassword(resetQueryDto: PasswordResetQueryDto, passwordResetBodyDto: PasswordResetBodyDto): {
        email: string;
        password: string;
        resetCode: string;
    };
    resetWorkerPassword(resetQueryDto: PasswordResetQueryDto, passwordResetBodyDto: PasswordResetBodyDto): {
        email: string;
        password: string;
        resetCode: string;
    };
}
