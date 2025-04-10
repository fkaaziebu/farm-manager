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
exports.AuthResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const auth_service_1 = require("./auth.service");
const admin_type_1 = require("../types/admin.type");
const worker_type_1 = require("../types/worker.type");
let AuthResolver = class AuthResolver {
    constructor(authService) {
        this.authService = authService;
    }
    async registerAdmin(name, email, password) {
        return this.authService.createAdmin({
            name,
            email,
            password,
        });
    }
    async loginAdmin(email, password) {
        return this.authService.loginAdmin({
            email,
            password,
        });
    }
    async loginWorker(email, password) {
        return this.authService.loginWorker({
            email,
            password,
        });
    }
    async requestAdminPasswordReset(email) {
        return this.authService.requestAdminPasswordReset({
            email,
        });
    }
    async requestWorkerPasswordReset(email) {
        return this.authService.requestWorkerPasswordReset({
            email,
        });
    }
    async resetAdminPassword(email, resetToken, password) {
        return this.authService.resetAdminPassword({
            email,
            resetCode: resetToken,
            password,
        });
    }
    async resetWorkerPassword(email, resetToken, password) {
        return this.authService.resetWorkerPassword({
            email,
            resetCode: resetToken,
            password,
        });
    }
};
exports.AuthResolver = AuthResolver;
__decorate([
    (0, graphql_1.Mutation)(() => admin_type_1.AdminType),
    __param(0, (0, graphql_1.Args)("name")),
    __param(1, (0, graphql_1.Args)("email")),
    __param(2, (0, graphql_1.Args)("password")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "registerAdmin", null);
__decorate([
    (0, graphql_1.Mutation)(() => admin_type_1.AdminType),
    __param(0, (0, graphql_1.Args)("email")),
    __param(1, (0, graphql_1.Args)("password")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "loginAdmin", null);
__decorate([
    (0, graphql_1.Mutation)(() => worker_type_1.WorkerType),
    __param(0, (0, graphql_1.Args)("email")),
    __param(1, (0, graphql_1.Args)("password")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "loginWorker", null);
__decorate([
    (0, graphql_1.Mutation)(() => admin_type_1.AdminType),
    __param(0, (0, graphql_1.Args)("email")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "requestAdminPasswordReset", null);
__decorate([
    (0, graphql_1.Mutation)(() => worker_type_1.WorkerType),
    __param(0, (0, graphql_1.Args)("email")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "requestWorkerPasswordReset", null);
__decorate([
    (0, graphql_1.Mutation)(() => admin_type_1.AdminType),
    __param(0, (0, graphql_1.Args)("email")),
    __param(1, (0, graphql_1.Args)("resetToken")),
    __param(2, (0, graphql_1.Args)("password")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "resetAdminPassword", null);
__decorate([
    (0, graphql_1.Mutation)(() => worker_type_1.WorkerType),
    __param(0, (0, graphql_1.Args)("email")),
    __param(1, (0, graphql_1.Args)("resetToken")),
    __param(2, (0, graphql_1.Args)("password")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AuthResolver.prototype, "resetWorkerPassword", null);
exports.AuthResolver = AuthResolver = __decorate([
    (0, graphql_1.Resolver)(() => admin_type_1.AdminType),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthResolver);
//# sourceMappingURL=auth.resolver.js.map