"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt = require("bcrypt");
const uuid_1 = require("uuid");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const email_producer_1 = require("../queue/producers/email.producer");
const admin_entity_1 = require("../entities/admin.entity");
const worker_entity_1 = require("../entities/worker.entity");
let AuthService = class AuthService {
    constructor(adminRepository, workerRepository, emailProducer, jwtService) {
        this.adminRepository = adminRepository;
        this.workerRepository = workerRepository;
        this.emailProducer = emailProducer;
        this.jwtService = jwtService;
    }
    async createAdmin(createAdminBodyDto) {
        return this.createEntity(createAdminBodyDto, admin_entity_1.Admin, this.adminRepository);
    }
    async loginAdmin(loginBodyDto) {
        return this.login(loginBodyDto, admin_entity_1.Admin, "admin", this.adminRepository);
    }
    async loginWorker(loginBodyDto) {
        return this.login(loginBodyDto, worker_entity_1.Worker, "worker", this.workerRepository);
    }
    async requestAdminPasswordReset({ email }) {
        return this.requestReset({ email }, admin_entity_1.Admin, "admin", this.adminRepository);
    }
    async requestWorkerPasswordReset({ email }) {
        return this.requestReset({ email }, worker_entity_1.Worker, "worker", this.workerRepository);
    }
    async createWorkers(email, workers) {
        return await this.adminRepository.manager.transaction(async (transactionalEntityManager) => {
            const admin = await transactionalEntityManager.findOne(admin_entity_1.Admin, {
                where: { email },
                relations: ["workers"],
            });
            if (!admin) {
                throw new common_1.BadRequestException("Admin does not exist");
            }
            const new_workers = await Promise.all(workers.map(async (worker) => {
                const workerBelongesToAdmin = admin.workers.find((wkr) => wkr.email === worker.email);
                if (workerBelongesToAdmin) {
                    return null;
                }
                const workerBelongesToOtherAdmin = await this.workerRepository.findOne({
                    where: {
                        email: worker.email,
                    },
                });
                if (workerBelongesToOtherAdmin) {
                    throw new common_1.BadRequestException(`This email has been used for a worker by a different admin, ${worker.email}`);
                }
                const new_worker = new worker_entity_1.Worker();
                new_worker.name = worker.name;
                new_worker.email = worker.email;
                new_worker.password = "";
                return this.workerRepository.save(new_worker);
            }));
            admin.workers = [...new_workers, ...admin.workers];
            await transactionalEntityManager.save(admin_entity_1.Admin, admin);
            return {
                message: "Worker(s) created successfully",
            };
        });
    }
    async resetAdminPassword({ email, password, resetCode, }) {
        return await this.resetPassword({ email, password, resetCode }, admin_entity_1.Admin, this.adminRepository);
    }
    async resetWorkerPassword({ email, password, resetCode, }) {
        return await this.resetPassword({ email, password, resetCode }, worker_entity_1.Worker, this.workerRepository);
    }
    async createEntity(data, Entity, repository) {
        return await repository.manager.transaction(async (transactionalEntityManager) => {
            const { email, name, password } = data;
            const existingUser = await transactionalEntityManager.findOne(Entity, {
                where: { email },
            });
            if (existingUser) {
                throw new common_1.BadRequestException("Email already exist");
            }
            const user = new Entity();
            user.name = name;
            user.email = email;
            user.password = await this.hashPassword(password);
            await transactionalEntityManager.save(Entity, user);
            return {
                message: "Successfully signed up",
            };
        });
    }
    async login(data, Entity, entityType, repository) {
        const { email, password } = data;
        const user = await repository.findOne({ where: { email } });
        if (!user) {
            throw new common_1.BadRequestException("Email or password is incorrect");
        }
        const validPassowrd = await bcrypt.compare(password, user.password);
        if (!validPassowrd) {
            throw new common_1.BadRequestException("Email or password is incorrect");
        }
        if (user.password_reset_code) {
            await this.resetPassword({
                email,
                password,
                resetCode: user.password_reset_code,
            }, Entity, repository);
        }
        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: entityType.toUpperCase(),
        };
        const access_token = this.jwtService.sign(payload);
        return {
            ...user,
            role: entityType.toUpperCase(),
            token: access_token,
        };
    }
    async requestReset(data, Entity, entityType, repository) {
        return await repository.manager.transaction(async (transactionalEntityManager) => {
            const { email } = data;
            const user = await transactionalEntityManager.findOne(Entity, {
                where: { email },
            });
            if (!user) {
                throw new common_1.BadRequestException("User not found");
            }
            const resetCode = (0, uuid_1.v4)();
            user.password_reset_code = resetCode;
            const savedUser = await transactionalEntityManager.save(Entity, user);
            await this.emailProducer.sendPasswordResetEmail({
                email,
                name: user.name,
                resetCode,
                role: entityType,
            });
            return {
                ...savedUser,
                message: "Password reset details sent to your email!",
            };
        });
    }
    async resetPassword(data, Entity, repository) {
        return await repository.manager.transaction(async (transactionalEntityManager) => {
            const { email, password, resetCode } = data;
            const user = await transactionalEntityManager.findOne(Entity, {
                where: { email },
            });
            if (!user) {
                throw new common_1.BadRequestException("User not found");
            }
            if (!user.password_reset_code) {
                throw new common_1.BadRequestException("User did not request a reset");
            }
            if (user.password_reset_code !== resetCode) {
                throw new common_1.BadRequestException("Incorrect resetCode");
            }
            user.password_reset_code = null;
            user.password = await this.hashPassword(password);
            user.password_reset_date = new Date();
            user.password_reseted = true;
            await transactionalEntityManager.save(Entity, user);
            return {
                message: "Password reset successful",
            };
        });
    }
    async hashPassword(password) {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(admin_entity_1.Admin)),
    __param(1, (0, typeorm_1.InjectRepository)(worker_entity_1.Worker)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        email_producer_1.EmailProducer,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map