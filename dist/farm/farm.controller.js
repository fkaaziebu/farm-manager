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
exports.FarmController = void 0;
const common_1 = require("@nestjs/common");
const farm_service_1 = require("./farm.service");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const roles_decorator_1 = require("./guards/roles.decorator");
const roles_guard_1 = require("./guards/roles.guard");
const dto_1 = require("./dto");
let FarmController = class FarmController {
    constructor(farmService) {
        this.farmService = farmService;
    }
    async createFarm(req, createFarmBodyDto) {
        const { email } = req.user;
        return this.farmService.createFarm({ ...createFarmBodyDto, email });
    }
    async addFarmWorkers(req, addFarmWorkersParamsDto, addFarmWorkersBodyDto) {
        const { email } = req.user;
        return this.farmService.addFarmWorkers({
            email,
            ...addFarmWorkersParamsDto,
            ...addFarmWorkersBodyDto,
        });
    }
    async addHousesToFarm(req, addHousesToFarmParamsDto, addHousesToFarmBodyDto) {
        const { email } = req.user;
        return this.farmService.addHousesToFarm({
            email,
            ...addHousesToFarmParamsDto,
            ...addHousesToFarmBodyDto,
        });
    }
    async addRoomsToHouse(req, addRoomsToHouseParamsDto, addRoomsToHouseBodyDto) {
        const { email } = req.user;
        return this.farmService.addRoomsToHouse({
            email,
            ...addRoomsToHouseParamsDto,
            ...addRoomsToHouseBodyDto,
        });
    }
    async addAnimalsToRoom(req, addAnimalsToRoomParamsDto, addAnimalsToRoomBodyDto) {
        const { email } = req.user;
        return this.farmService.addAnimalsToRoom({
            email,
            ...addAnimalsToRoomParamsDto,
            ...addAnimalsToRoomBodyDto,
        });
    }
    async addAnimalBreedingRecord(req, addAnimalBreedingRecordBodyDto) {
        const { email, role } = req.user;
        return this.farmService.addAnimalBreedingRecord({
            email,
            role,
            ...addAnimalBreedingRecordBodyDto,
        });
    }
    async addAnimalExpenseRecord(req, addAnimalExpenseRecordParamsDto, addAnimalExpenseRecordBodyDto) {
        const { email, role } = req.user;
        return this.farmService.addAnimalExpenseRecord({
            email,
            role,
            ...addAnimalExpenseRecordParamsDto,
            ...addAnimalExpenseRecordBodyDto,
        });
    }
    async addAnimalGrowthRecord(req, addAnimalGrowthRecordParamsDto, addAnimalGrowthRecordBodyDto) {
        const { email, role } = req.user;
        return this.farmService.addAnimalGrowthRecord({
            email,
            role,
            ...addAnimalGrowthRecordParamsDto,
            ...addAnimalGrowthRecordBodyDto,
        });
    }
    async addAnimalHealthRecord(req, addAnimalHealthRecordParamsDto, addAnimalHealthRecordBodyDto) {
        const { email, role } = req.user;
        return this.farmService.addAnimalHealthRecord({
            email,
            role,
            ...addAnimalHealthRecordParamsDto,
            ...addAnimalHealthRecordBodyDto,
        });
    }
    async addAnimalSalesRecord(req, addAnimalSalesRecordParamsDto, addAnimalSalesRecordBodyDto) {
        const { email, role } = req.user;
        return this.farmService.addAnimalSalesRecord({
            email,
            role,
            ...addAnimalSalesRecordParamsDto,
            ...addAnimalSalesRecordBodyDto,
        });
    }
};
exports.FarmController = FarmController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("admin"),
    (0, common_1.Post)("/farm:add"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.CreateFarmBodyDto]),
    __metadata("design:returntype", Promise)
], FarmController.prototype, "createFarm", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("admin"),
    (0, common_1.Post)("/farms/:farmId/workers:add"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.AddFarmWorkersParamsDto,
        dto_1.AddFarmWorkersBodyDto]),
    __metadata("design:returntype", Promise)
], FarmController.prototype, "addFarmWorkers", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("admin"),
    (0, common_1.Post)("/farm/:farmId/houses:add"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.AddFarmWorkersParamsDto,
        dto_1.AddHousesToFarmBodyDto]),
    __metadata("design:returntype", Promise)
], FarmController.prototype, "addHousesToFarm", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("admin"),
    (0, common_1.Post)("/farm/:farmId/houses/:houseNumber/rooms:add"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.AddRoomsToHouseParamsDto,
        dto_1.AddRoomsToHouseBodyDto]),
    __metadata("design:returntype", Promise)
], FarmController.prototype, "addRoomsToHouse", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("admin"),
    (0, common_1.Post)("/farm/:farmId/houses/:houseNumber/rooms/:roomNumber/animals:add"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.AddAnimalsToRoomParamsDto,
        dto_1.AddAnimalsToRoomBodyDto]),
    __metadata("design:returntype", Promise)
], FarmController.prototype, "addAnimalsToRoom", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("admin", "worker"),
    (0, common_1.Post)("/breeding-record:add"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.AddAnimalBreedingRecordBodyDto]),
    __metadata("design:returntype", Promise)
], FarmController.prototype, "addAnimalBreedingRecord", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("admin", "worker"),
    (0, common_1.Post)("/animals/:tagNumber/expense-record:add"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.AddAnimalExpenseRecordParamsDto,
        dto_1.AddAnimalExpenseRecordBodyDto]),
    __metadata("design:returntype", Promise)
], FarmController.prototype, "addAnimalExpenseRecord", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("admin", "worker"),
    (0, common_1.Post)("/animals/:tagNumber/growth-record:add"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.AddAnimalExpenseRecordParamsDto,
        dto_1.AddAnimalGrowthRecordBodyDto]),
    __metadata("design:returntype", Promise)
], FarmController.prototype, "addAnimalGrowthRecord", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("admin", "worker"),
    (0, common_1.Post)("/animals/:tagNumber/health-record:add"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.AddAnimalExpenseRecordParamsDto,
        dto_1.AddAnimalHealthRecordBodyDto]),
    __metadata("design:returntype", Promise)
], FarmController.prototype, "addAnimalHealthRecord", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("admin", "worker"),
    (0, common_1.Post)("/animals/:tagNumber/sales-record:add"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.AddAnimalExpenseRecordParamsDto,
        dto_1.AddAnimalSalesRecordBodyDto]),
    __metadata("design:returntype", Promise)
], FarmController.prototype, "addAnimalSalesRecord", null);
exports.FarmController = FarmController = __decorate([
    (0, common_1.Controller)("v1"),
    __metadata("design:paramtypes", [farm_service_1.FarmService])
], FarmController);
//# sourceMappingURL=farm.controller.js.map