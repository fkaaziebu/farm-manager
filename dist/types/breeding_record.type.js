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
exports.BreedingRecordType = void 0;
const graphql_1 = require("@nestjs/graphql");
const animal_type_1 = require("./animal.type");
var BreedingStatus;
(function (BreedingStatus) {
    BreedingStatus["IN_PROGRESS"] = "IN_PROGRESS";
    BreedingStatus["SUCCESSFUL"] = "SUCCESSFUL";
    BreedingStatus["FAILED"] = "FAILED";
    BreedingStatus["CANCELLED"] = "CANCELLED";
})(BreedingStatus || (BreedingStatus = {}));
(0, graphql_1.registerEnumType)(BreedingStatus, {
    name: "BreedingStatus",
});
let BreedingRecordType = class BreedingRecordType {
};
exports.BreedingRecordType = BreedingRecordType;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", Number)
], BreedingRecordType.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], BreedingRecordType.prototype, "mating_date", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], BreedingRecordType.prototype, "expected_delivery", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Date)
], BreedingRecordType.prototype, "actual_delivery", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], BreedingRecordType.prototype, "liter_size", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], BreedingRecordType.prototype, "notes", void 0);
__decorate([
    (0, graphql_1.Field)(() => BreedingStatus),
    __metadata("design:type", String)
], BreedingRecordType.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)(() => [animal_type_1.AnimalType], { nullable: true }),
    __metadata("design:type", Array)
], BreedingRecordType.prototype, "animals", void 0);
exports.BreedingRecordType = BreedingRecordType = __decorate([
    (0, graphql_1.ObjectType)("BreedingRecord")
], BreedingRecordType);
//# sourceMappingURL=breeding_record.type.js.map