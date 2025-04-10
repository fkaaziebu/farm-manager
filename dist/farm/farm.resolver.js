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
exports.FarmResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const farm_type_1 = require("../types/farm.type");
const farm_service_1 = require("./farm.service");
const common_1 = require("@nestjs/common");
const gql_jwt_auth_guard_1 = require("./guards/gql-jwt-auth.guard");
const pagination_type_1 = require("./pagination/pagination.type");
const farm_sort_input_1 = require("./inputs/farm-sort.input");
const farm_filters_input_1 = require("./inputs/farm-filters.input");
const farm_connection_type_1 = require("../types/farm-connection.type");
const worker_type_1 = require("../types/worker.type");
const worker_sort_input_1 = require("./inputs/worker-sort.input");
const farm_entity_1 = require("../entities/farm.entity");
const animal_sort_input_1 = require("./inputs/animal-sort.input");
const animal_type_1 = require("../types/animal.type");
const house_type_1 = require("../types/house.type");
const house_sort_input_1 = require("./inputs/house-sort.input");
const worker_id_input_1 = require("./inputs/worker-id.input");
const create_worker_input_1 = require("./inputs/create-worker.input");
const create_animal_input_1 = require("./inputs/create-animal.input");
const create_room_input_1 = require("./inputs/create-room.input");
const breeding_record_type_1 = require("../types/breeding_record.type");
const growth_record_entity_1 = require("../entities/growth_record.entity");
const expense_record_entity_1 = require("../entities/expense_record.entity");
const sales_record_type_1 = require("../types/sales_record.type");
const expense_record_type_1 = require("../types/expense_record.type");
const growth_record_type_1 = require("../types/growth_record.type");
const health_record_type_1 = require("../types/health_record.type");
let FarmResolver = class FarmResolver {
    constructor(farmService) {
        this.farmService = farmService;
    }
    listFarms(context, filter, searchTerm, pagination, sort) {
        const { email, role } = context.req.user;
        return this.farmService.listFarmsPaginated({
            email,
            role,
            filter,
            searchTerm,
            pagination: pagination || {},
            sort,
        });
    }
    async getWorkers(farm, filter, pagination, sort) {
        if (!filter && !pagination && !sort) {
            return farm.workers || [];
        }
    }
    async getAnimals(farm, filter, pagination, sort) {
        if (!filter && !pagination && !sort) {
            return farm.animals || [];
        }
    }
    async getHouses(farm, filter, pagination, sort) {
        if (!filter && !pagination && !sort) {
            return farm.houses || [];
        }
    }
    createFarm(context, name, location, area) {
        const { email } = context.req.user;
        return this.farmService.createFarm({ name, location, area, email });
    }
    addWorkersToFarm(context, farmId, workerIds) {
        const { email } = context.req.user;
        return this.farmService.addFarmWorkers({ farmId, workerIds, email });
    }
    async createAndAddWorkerToFarm(context, farmId, workers) {
        const { email } = context.req.user;
        const createdWorkers = await this.farmService.createWorkers({
            email,
            workers,
        });
        return this.farmService.addFarmWorkers({
            farmId,
            workerIds: createdWorkers.workerIds,
            email,
        });
    }
    addHouseToFarm(context, farmId, houseNumber, rooms) {
        const { email } = context.req.user;
        return this.farmService.addHouseToFarm({
            farmId,
            houseNumber,
            rooms,
            email,
        });
    }
    addAnimalsToFarm(context, farmId, houseNumber, roomNumber, animals) {
        const { email } = context.req.user;
        return this.farmService.addAnimalsToRoom({
            farmId,
            houseNumber,
            roomNumber,
            animals,
            email,
        });
    }
    addAnimalBreedingRecord(context, maleTagNumber, femaleTagNumber, matingDate, expectedDelivery) {
        const { email, role } = context.req.user;
        return this.farmService.addAnimalBreedingRecord({
            email,
            role,
            maleTagNumber,
            femaleTagNumber,
            matingDate,
            expectedDelivery,
        });
    }
    addAnimalHealthRecord(context, tagNumber, issue, symptoms, diagnosis, medication, vet_name, cost, notes) {
        const { email, role } = context.req.user;
        return this.farmService.addAnimalHealthRecord({
            email,
            role,
            tagNumber,
            issue,
            symptoms,
            diagnosis,
            medication,
            vet_name,
            cost,
            notes,
        });
    }
    addAnimalGrowthRecord(context, tagNumber, period, growthRate, notes) {
        const { email, role } = context.req.user;
        return this.farmService.addAnimalGrowthRecord({
            email,
            role,
            tagNumber,
            period,
            growthRate,
            notes,
        });
    }
    addAnimalExpenseRecord(context, tagNumber, category, expenseDate, amount, notes) {
        const { email, role } = context.req.user;
        return this.farmService.addAnimalExpenseRecord({
            email,
            role,
            tagNumber,
            category,
            expenseDate,
            amount,
            notes,
        });
    }
    addAnimalSalesRecord(context, tagNumber, buyerName, saleDate, priceSold, notes) {
        const { email, role } = context.req.user;
        return this.farmService.addAnimalSalesRecord({
            email,
            role,
            tagNumber,
            buyerName,
            saleDate,
            priceSold,
            notes,
        });
    }
};
exports.FarmResolver = FarmResolver;
__decorate([
    (0, common_1.UseGuards)(gql_jwt_auth_guard_1.GqlJwtAuthGuard),
    (0, graphql_1.Query)(() => farm_connection_type_1.FarmConnection),
    __param(0, (0, graphql_1.Context)()),
    __param(1, (0, graphql_1.Args)("filter", { nullable: true })),
    __param(2, (0, graphql_1.Args)("searchTerm", { nullable: true })),
    __param(3, (0, graphql_1.Args)("pagination", { nullable: true })),
    __param(4, (0, graphql_1.Args)("sort", { type: () => [farm_sort_input_1.FarmSortInput], nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, farm_filters_input_1.FarmFilterInput, String, pagination_type_1.PaginationInput, Array]),
    __metadata("design:returntype", void 0)
], FarmResolver.prototype, "listFarms", null);
__decorate([
    (0, graphql_1.ResolveField)("workers", () => [worker_type_1.WorkerType]),
    __param(0, (0, graphql_1.Parent)()),
    __param(1, (0, graphql_1.Args)("filter", { nullable: true })),
    __param(2, (0, graphql_1.Args)("pagination", { nullable: true })),
    __param(3, (0, graphql_1.Args)("sort", { type: () => [worker_sort_input_1.WorkerSortInput], nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [farm_entity_1.Farm,
        farm_filters_input_1.WorkerFilterInput,
        pagination_type_1.PaginationInput, Array]),
    __metadata("design:returntype", Promise)
], FarmResolver.prototype, "getWorkers", null);
__decorate([
    (0, graphql_1.ResolveField)("animals", () => [animal_type_1.AnimalType]),
    __param(0, (0, graphql_1.Parent)()),
    __param(1, (0, graphql_1.Args)("filter", { nullable: true })),
    __param(2, (0, graphql_1.Args)("pagination", { nullable: true })),
    __param(3, (0, graphql_1.Args)("sort", { type: () => [animal_sort_input_1.AnimalSortInput], nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [farm_entity_1.Farm,
        farm_filters_input_1.AnimalFilterInput,
        pagination_type_1.PaginationInput, Array]),
    __metadata("design:returntype", Promise)
], FarmResolver.prototype, "getAnimals", null);
__decorate([
    (0, graphql_1.ResolveField)("houses", () => [house_type_1.HouseType]),
    __param(0, (0, graphql_1.Parent)()),
    __param(1, (0, graphql_1.Args)("filter", { nullable: true })),
    __param(2, (0, graphql_1.Args)("pagination", { nullable: true })),
    __param(3, (0, graphql_1.Args)("sort", { type: () => [house_sort_input_1.HouseSortInput], nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [farm_entity_1.Farm,
        farm_filters_input_1.HouseFilterInput,
        pagination_type_1.PaginationInput, Array]),
    __metadata("design:returntype", Promise)
], FarmResolver.prototype, "getHouses", null);
__decorate([
    (0, common_1.UseGuards)(gql_jwt_auth_guard_1.GqlJwtAuthGuard),
    (0, graphql_1.Mutation)(() => farm_type_1.FarmType),
    __param(0, (0, graphql_1.Context)()),
    __param(1, (0, graphql_1.Args)("name")),
    __param(2, (0, graphql_1.Args)("location")),
    __param(3, (0, graphql_1.Args)("area")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", void 0)
], FarmResolver.prototype, "createFarm", null);
__decorate([
    (0, common_1.UseGuards)(gql_jwt_auth_guard_1.GqlJwtAuthGuard),
    (0, graphql_1.Mutation)(() => worker_type_1.WorkerType),
    __param(0, (0, graphql_1.Context)()),
    __param(1, (0, graphql_1.Args)("farmId")),
    __param(2, (0, graphql_1.Args)("workerIds", { type: () => [worker_id_input_1.WorkerIdInput], nullable: false })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Array]),
    __metadata("design:returntype", void 0)
], FarmResolver.prototype, "addWorkersToFarm", null);
__decorate([
    (0, common_1.UseGuards)(gql_jwt_auth_guard_1.GqlJwtAuthGuard),
    (0, graphql_1.Mutation)(() => worker_type_1.WorkerType),
    __param(0, (0, graphql_1.Context)()),
    __param(1, (0, graphql_1.Args)("farmId")),
    __param(2, (0, graphql_1.Args)("workers", { type: () => [create_worker_input_1.CreateWorkerInput], nullable: false })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Array]),
    __metadata("design:returntype", Promise)
], FarmResolver.prototype, "createAndAddWorkerToFarm", null);
__decorate([
    (0, common_1.UseGuards)(gql_jwt_auth_guard_1.GqlJwtAuthGuard),
    (0, graphql_1.Mutation)(() => house_type_1.HouseType),
    __param(0, (0, graphql_1.Context)()),
    __param(1, (0, graphql_1.Args)("farmId")),
    __param(2, (0, graphql_1.Args)("houseNumber")),
    __param(3, (0, graphql_1.Args)("rooms", { type: () => [create_room_input_1.CreateRoomInput], nullable: false })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Array]),
    __metadata("design:returntype", void 0)
], FarmResolver.prototype, "addHouseToFarm", null);
__decorate([
    (0, common_1.UseGuards)(gql_jwt_auth_guard_1.GqlJwtAuthGuard),
    (0, graphql_1.Mutation)(() => farm_type_1.FarmType),
    __param(0, (0, graphql_1.Context)()),
    __param(1, (0, graphql_1.Args)("farmId")),
    __param(2, (0, graphql_1.Args)("houseNumber")),
    __param(3, (0, graphql_1.Args)("roomNumber")),
    __param(4, (0, graphql_1.Args)("animals", { type: () => [create_animal_input_1.CreateAnimalInput], nullable: false })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, Array]),
    __metadata("design:returntype", void 0)
], FarmResolver.prototype, "addAnimalsToFarm", null);
__decorate([
    (0, common_1.UseGuards)(gql_jwt_auth_guard_1.GqlJwtAuthGuard),
    (0, graphql_1.Mutation)(() => breeding_record_type_1.BreedingRecordType),
    __param(0, (0, graphql_1.Context)()),
    __param(1, (0, graphql_1.Args)("maleTagNumber")),
    __param(2, (0, graphql_1.Args)("femaleTagNumber")),
    __param(3, (0, graphql_1.Args)("matingDate")),
    __param(4, (0, graphql_1.Args)("expectedDelivery")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Date,
        Date]),
    __metadata("design:returntype", void 0)
], FarmResolver.prototype, "addAnimalBreedingRecord", null);
__decorate([
    (0, common_1.UseGuards)(gql_jwt_auth_guard_1.GqlJwtAuthGuard),
    (0, graphql_1.Mutation)(() => health_record_type_1.HealthRecordType),
    __param(0, (0, graphql_1.Context)()),
    __param(1, (0, graphql_1.Args)("tagNumber")),
    __param(2, (0, graphql_1.Args)("issue")),
    __param(3, (0, graphql_1.Args)("symptoms")),
    __param(4, (0, graphql_1.Args)("diagnosis")),
    __param(5, (0, graphql_1.Args)("medication")),
    __param(6, (0, graphql_1.Args)("vet_name")),
    __param(7, (0, graphql_1.Args)("cost")),
    __param(8, (0, graphql_1.Args)("notes")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String, String, Number, String]),
    __metadata("design:returntype", void 0)
], FarmResolver.prototype, "addAnimalHealthRecord", null);
__decorate([
    (0, common_1.UseGuards)(gql_jwt_auth_guard_1.GqlJwtAuthGuard),
    (0, graphql_1.Mutation)(() => growth_record_type_1.GrowthRecordType),
    __param(0, (0, graphql_1.Context)()),
    __param(1, (0, graphql_1.Args)("tagNumber")),
    __param(2, (0, graphql_1.Args)("period")),
    __param(3, (0, graphql_1.Args)("growthRate")),
    __param(4, (0, graphql_1.Args)("notes")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Number, String]),
    __metadata("design:returntype", void 0)
], FarmResolver.prototype, "addAnimalGrowthRecord", null);
__decorate([
    (0, common_1.UseGuards)(gql_jwt_auth_guard_1.GqlJwtAuthGuard),
    (0, graphql_1.Mutation)(() => expense_record_type_1.ExpenseRecordType),
    __param(0, (0, graphql_1.Context)()),
    __param(1, (0, graphql_1.Args)("tagNumber")),
    __param(2, (0, graphql_1.Args)("category")),
    __param(3, (0, graphql_1.Args)("expenseDate")),
    __param(4, (0, graphql_1.Args)("amount")),
    __param(5, (0, graphql_1.Args)("notes")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Date, Number, String]),
    __metadata("design:returntype", void 0)
], FarmResolver.prototype, "addAnimalExpenseRecord", null);
__decorate([
    (0, common_1.UseGuards)(gql_jwt_auth_guard_1.GqlJwtAuthGuard),
    (0, graphql_1.Mutation)(() => sales_record_type_1.SalesRecordType),
    __param(0, (0, graphql_1.Context)()),
    __param(1, (0, graphql_1.Args)("tagNumber")),
    __param(2, (0, graphql_1.Args)("buyerName")),
    __param(3, (0, graphql_1.Args)("saleDate")),
    __param(4, (0, graphql_1.Args)("priceSold")),
    __param(5, (0, graphql_1.Args)("notes")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Date, Number, String]),
    __metadata("design:returntype", void 0)
], FarmResolver.prototype, "addAnimalSalesRecord", null);
exports.FarmResolver = FarmResolver = __decorate([
    (0, graphql_1.Resolver)(() => farm_type_1.FarmType),
    __metadata("design:paramtypes", [farm_service_1.FarmService])
], FarmResolver);
//# sourceMappingURL=farm.resolver.js.map