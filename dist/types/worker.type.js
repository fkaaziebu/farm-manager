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
exports.WorkerType = void 0;
const graphql_1 = require("@nestjs/graphql");
const farm_type_1 = require("./farm.type");
const admin_type_1 = require("./admin.type");
const worker_entity_1 = require("../entities/worker.entity");
(0, graphql_1.registerEnumType)(worker_entity_1.WorkerRole, {
    name: "WorkerRole",
});
let WorkerType = class WorkerType {
};
exports.WorkerType = WorkerType;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", Number)
], WorkerType.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], WorkerType.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], WorkerType.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], WorkerType.prototype, "role", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], WorkerType.prototype, "token", void 0);
__decorate([
    (0, graphql_1.Field)(() => [worker_entity_1.WorkerRole]),
    __metadata("design:type", Array)
], WorkerType.prototype, "roles", void 0);
__decorate([
    (0, graphql_1.Field)(() => [farm_type_1.FarmType], { nullable: true }),
    __metadata("design:type", Array)
], WorkerType.prototype, "farms", void 0);
__decorate([
    (0, graphql_1.Field)(() => admin_type_1.AdminType, { nullable: true }),
    __metadata("design:type", admin_type_1.AdminType)
], WorkerType.prototype, "admin", void 0);
exports.WorkerType = WorkerType = __decorate([
    (0, graphql_1.ObjectType)("Worker")
], WorkerType);
//# sourceMappingURL=worker.type.js.map