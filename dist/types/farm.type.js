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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FarmType = void 0;
const graphql_1 = require("@nestjs/graphql");
const admin_type_1 = require("./admin.type");
const worker_type_1 = require("./worker.type");
const animal_type_1 = require("./animal.type");
const house_type_1 = require("./house.type");
let FarmType = class FarmType {
};
exports.FarmType = FarmType;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", Number)
], FarmType.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], FarmType.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], FarmType.prototype, "location", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], FarmType.prototype, "area", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], FarmType.prototype, "performance", void 0);
__decorate([
    (0, graphql_1.Field)(() => admin_type_1.AdminType, { nullable: true }),
    __metadata("design:type", admin_type_1.AdminType)
], FarmType.prototype, "admin", void 0);
__decorate([
    (0, graphql_1.Field)(() => [worker_type_1.WorkerType], { nullable: true }),
    __metadata("design:type", Array)
], FarmType.prototype, "workers", void 0);
__decorate([
    (0, graphql_1.Field)(() => [house_type_1.HouseType], { nullable: true }),
    __metadata("design:type", Array)
], FarmType.prototype, "houses", void 0);
__decorate([
    (0, graphql_1.Field)(() => [animal_type_1.AnimalType], { nullable: true }),
    __metadata("design:type", Array)
], FarmType.prototype, "animals", void 0);
exports.FarmType = FarmType = __decorate([
    (0, graphql_1.ObjectType)("Farm")
], FarmType);
//# sourceMappingURL=farm.type.js.map