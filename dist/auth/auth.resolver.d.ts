import { AuthService } from "./auth.service";
export declare class AuthResolver {
    private readonly authService;
    constructor(authService: AuthService);
    registerAdmin(name: string, email: string, password: string): Promise<any>;
    loginAdmin(email: string, password: string): Promise<any>;
    loginWorker(email: string, password: string): Promise<any>;
    requestAdminPasswordReset(email: string): Promise<any>;
    requestWorkerPasswordReset(email: string): Promise<any>;
    resetAdminPassword(email: string, resetToken: string, password: string): Promise<any>;
    resetWorkerPassword(email: string, resetToken: string, password: string): Promise<any>;
}
