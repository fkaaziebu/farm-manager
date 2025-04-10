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
exports.AdminType = void 0;
const graphql_1 = require("@nestjs/graphql");
const farm_type_1 = require("./farm.type");
const worker_type_1 = require("./worker.type");
let AdminType = class AdminType {
};
exports.AdminType = AdminType;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", Number)
], AdminType.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], AdminType.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], AdminType.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], AdminType.prototype, "role", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], AdminType.prototype, "token", void 0);
__decorate([
    (0, graphql_1.Field)(() => [farm_type_1.FarmType], { nullable: true }),
    __metadata("design:type", Array)
], AdminType.prototype, "farms", void 0);
__decorate([
    (0, graphql_1.Field)(() => [worker_type_1.WorkerType], { nullable: true }),
    __metadata("design:type", Array)
], AdminType.prototype, "workers", void 0);
exports.AdminType = AdminType = __decorate([
    (0, graphql_1.ObjectType)("Admin")
], AdminType);
//# sourceMappingURL=admin.type.js.map