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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async createAdminAccount(createAdminBodyDto) {
        return this.authService.createAdmin({
            ...createAdminBodyDto,
        });
    }
    loginAdmin(loginBodyDto) {
        return {
            ...loginBodyDto,
        };
    }
    loginWorker(loginBodyDto) {
        return {
            ...loginBodyDto,
        };
    }
    requestAdminPasswordReset(passwordResetBodyDto) {
        return {
            ...passwordResetBodyDto,
        };
    }
    requestWorkerPasswordReset(passwordResetBodyDto) {
        return {
            ...passwordResetBodyDto,
        };
    }
    resetAdminPassword(resetQueryDto, passwordResetBodyDto) {
        return {
            ...resetQueryDto,
            ...passwordResetBodyDto,
        };
    }
    resetWorkerPassword(resetQueryDto, passwordResetBodyDto) {
        return {
            ...resetQueryDto,
            ...passwordResetBodyDto,
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)("/auth/admins/register"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "createAdminAccount", null);
__decorate([
    (0, common_1.Post)("/auth/admins/login"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "loginAdmin", null);
__decorate([
    (0, common_1.Post)("/auth/workers/login"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "loginWorker", null);
__decorate([
    (0, common_1.Post)("/auth/admins/request-password-reset"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "requestAdminPasswordReset", null);
__decorate([
    (0, common_1.Post)("/auth/workers/request-password-reset"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "requestWorkerPasswordReset", null);
__decorate([
    (0, common_1.Patch)("/auth/admins/reset-password"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Function]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "resetAdminPassword", null);
__decorate([
    (0, common_1.Patch)("/auth/workers/reset-password"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Function]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "resetWorkerPassword", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)("v1"),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map