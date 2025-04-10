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
exports.HealthRecordType = void 0;
const graphql_1 = require("@nestjs/graphql");
const animal_type_1 = require("./animal.type");
let HealthRecordType = class HealthRecordType {
};
exports.HealthRecordType = HealthRecordType;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", Number)
], HealthRecordType.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], HealthRecordType.prototype, "issue", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], HealthRecordType.prototype, "symptoms", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], HealthRecordType.prototype, "diagnosis", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], HealthRecordType.prototype, "medication", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], HealthRecordType.prototype, "vet_name", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], HealthRecordType.prototype, "cost", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], HealthRecordType.prototype, "notes", void 0);
__decorate([
    (0, graphql_1.Field)(() => animal_type_1.AnimalType, { nullable: true }),
    __metadata("design:type", animal_type_1.AnimalType)
], HealthRecordType.prototype, "animal", void 0);
exports.HealthRecordType = HealthRecordType = __decorate([
    (0, graphql_1.ObjectType)("HealthRecord")
], HealthRecordType);
//# sourceMappingURL=health_record.type.js.map