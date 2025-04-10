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
exports.AnimalType = void 0;
const graphql_1 = require("@nestjs/graphql");
const farm_type_1 = require("./farm.type");
const room_type_1 = require("./room.type");
const breeding_record_type_1 = require("./breeding_record.type");
const growth_record_type_1 = require("./growth_record.type");
const expense_record_type_1 = require("./expense_record.type");
const health_record_type_1 = require("./health_record.type");
const sales_record_type_1 = require("./sales_record.type");
const animal_entity_1 = require("../entities/animal.entity");
(0, graphql_1.registerEnumType)(animal_entity_1.HealthStatus, {
    name: "HealthStatus",
});
(0, graphql_1.registerEnumType)(animal_entity_1.FarmAnimalType, {
    name: "FarmAnimalType",
});
let AnimalType = class AnimalType {
};
exports.AnimalType = AnimalType;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", Number)
], AnimalType.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], AnimalType.prototype, "tag_number", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], AnimalType.prototype, "gender", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], AnimalType.prototype, "birth_date", void 0);
__decorate([
    (0, graphql_1.Field)(() => animal_entity_1.FarmAnimalType),
    __metadata("design:type", String)
], AnimalType.prototype, "type", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], AnimalType.prototype, "breed", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], AnimalType.prototype, "weight", void 0);
__decorate([
    (0, graphql_1.Field)(() => animal_entity_1.HealthStatus),
    __metadata("design:type", String)
], AnimalType.prototype, "health_status", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], AnimalType.prototype, "available", void 0);
__decorate([
    (0, graphql_1.Field)(() => [AnimalType], { nullable: true }),
    __metadata("design:type", Array)
], AnimalType.prototype, "direct_parents", void 0);
__decorate([
    (0, graphql_1.Field)(() => [AnimalType], { nullable: true }),
    __metadata("design:type", Array)
], AnimalType.prototype, "direct_children", void 0);
__decorate([
    (0, graphql_1.Field)(() => farm_type_1.FarmType, { nullable: true }),
    __metadata("design:type", farm_type_1.FarmType)
], AnimalType.prototype, "farm", void 0);
__decorate([
    (0, graphql_1.Field)(() => room_type_1.RoomType, { nullable: true }),
    __metadata("design:type", room_type_1.RoomType)
], AnimalType.prototype, "room", void 0);
__decorate([
    (0, graphql_1.Field)(() => [breeding_record_type_1.BreedingRecordType], { nullable: true }),
    __metadata("design:type", Array)
], AnimalType.prototype, "breeding_records", void 0);
__decorate([
    (0, graphql_1.Field)(() => [growth_record_type_1.GrowthRecordType], { nullable: true }),
    __metadata("design:type", Array)
], AnimalType.prototype, "growth_records", void 0);
__decorate([
    (0, graphql_1.Field)(() => [expense_record_type_1.ExpenseRecordType], { nullable: true }),
    __metadata("design:type", Array)
], AnimalType.prototype, "expense_records", void 0);
__decorate([
    (0, graphql_1.Field)(() => [health_record_type_1.HealthRecordType], { nullable: true }),
    __metadata("design:type", Array)
], AnimalType.prototype, "health_records", void 0);
__decorate([
    (0, graphql_1.Field)(() => sales_record_type_1.SalesRecordType, { nullable: true }),
    __metadata("design:type", sales_record_type_1.SalesRecordType)
], AnimalType.prototype, "sales_record", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], AnimalType.prototype, "inserted_at", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], AnimalType.prototype, "updated_at", void 0);
exports.AnimalType = AnimalType = __decorate([
    (0, graphql_1.ObjectType)("Animal")
], AnimalType);
//# sourceMappingURL=animal.type.js.map