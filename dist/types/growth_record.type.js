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
exports.GrowthRecordType = void 0;
const graphql_1 = require("@nestjs/graphql");
const animal_type_1 = require("./animal.type");
const growth_record_entity_1 = require("../entities/growth_record.entity");
(0, graphql_1.registerEnumType)(growth_record_entity_1.GrowthPeriod, {
    name: "GrowthPeriod",
});
let GrowthRecordType = class GrowthRecordType {
};
exports.GrowthRecordType = GrowthRecordType;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", Number)
], GrowthRecordType.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => growth_record_entity_1.GrowthPeriod),
    __metadata("design:type", String)
], GrowthRecordType.prototype, "period", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], GrowthRecordType.prototype, "growth_rate", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], GrowthRecordType.prototype, "notes", void 0);
__decorate([
    (0, graphql_1.Field)(() => animal_type_1.AnimalType, { nullable: true }),
    __metadata("design:type", animal_type_1.AnimalType)
], GrowthRecordType.prototype, "animal", void 0);
exports.GrowthRecordType = GrowthRecordType = __decorate([
    (0, graphql_1.ObjectType)("GrowthRecord")
], GrowthRecordType);
//# sourceMappingURL=growth_record.type.js.map