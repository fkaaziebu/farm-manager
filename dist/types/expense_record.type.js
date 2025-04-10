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
exports.ExpenseRecordType = void 0;
const graphql_1 = require("@nestjs/graphql");
const animal_type_1 = require("./animal.type");
const expense_record_entity_1 = require("../entities/expense_record.entity");
(0, graphql_1.registerEnumType)(expense_record_entity_1.ExpenseCategory, {
    name: "ExpenseCategory",
});
let ExpenseRecordType = class ExpenseRecordType {
};
exports.ExpenseRecordType = ExpenseRecordType;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", Number)
], ExpenseRecordType.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => expense_record_entity_1.ExpenseCategory),
    __metadata("design:type", String)
], ExpenseRecordType.prototype, "category", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], ExpenseRecordType.prototype, "expense_date", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], ExpenseRecordType.prototype, "amount", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ExpenseRecordType.prototype, "notes", void 0);
__decorate([
    (0, graphql_1.Field)(() => animal_type_1.AnimalType, { nullable: true }),
    __metadata("design:type", animal_type_1.AnimalType)
], ExpenseRecordType.prototype, "animal", void 0);
exports.ExpenseRecordType = ExpenseRecordType = __decorate([
    (0, graphql_1.ObjectType)("ExpenseRecord")
], ExpenseRecordType);
//# sourceMappingURL=expense_record.type.js.map