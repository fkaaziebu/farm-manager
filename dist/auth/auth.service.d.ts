import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { EmailProducer } from "../queue/producers/email.producer";
import { CreateAdminBodyDto } from "./dto/create-admin-body.dto";
import { LoginBodyDto } from "./dto/login-body.dto";
import { WorkerDto } from "./dto/create-workers-body.dto";
import { PasswordResetBodyDto } from "./dto/password-reset-body.dto";
import { PasswordResetQueryDto } from "./dto/password-reset-query.dto";
import { Admin } from "../entities/admin.entity";
import { Worker } from "../entities/worker.entity";
export declare class AuthService {
    private adminRepository;
    private workerRepository;
    private readonly emailProducer;
    private jwtService;
    constructor(adminRepository: Repository<Admin>, workerRepository: Repository<Worker>, emailProducer: EmailProducer, jwtService: JwtService);
    createAdmin(createAdminBodyDto: CreateAdminBodyDto): Promise<any>;
    loginAdmin(loginBodyDto: LoginBodyDto): Promise<any>;
    loginWorker(loginBodyDto: LoginBodyDto): Promise<any>;
    requestAdminPasswordReset({ email }: {
        email: string;
    }): Promise<any>;
    requestWorkerPasswordReset({ email }: {
        email: string;
    }): Promise<any>;
    createWorkers(email: string, workers: Array<WorkerDto>): Promise<{
        message: string;
    }>;
    resetAdminPassword({ email, password, resetCode, }: PasswordResetBodyDto & PasswordResetQueryDto): Promise<any>;
    resetWorkerPassword({ email, password, resetCode, }: PasswordResetBodyDto & PasswordResetQueryDto): Promise<any>;
    private createEntity;
    private login;
    private requestReset;
    private resetPassword;
    private hashPassword;
}
