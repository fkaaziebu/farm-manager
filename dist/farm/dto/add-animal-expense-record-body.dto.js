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
exports.AddAnimalExpenseRecordBodyDto = void 0;
const class_validator_1 = require("class-validator");
const expense_record_entity_1 = require("../../entities/expense_record.entity");
class AddAnimalExpenseRecordBodyDto {
}
exports.AddAnimalExpenseRecordBodyDto = AddAnimalExpenseRecordBodyDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(expense_record_entity_1.ExpenseCategory, {
        message: "Category must be one of: FEED, MEDICAL, VACCINATION, BREEDING, IDENTIFICATION, GROOMING, SUPPLEMENTS, TESTING, QUARANTINE, TRANSPORT, SPECIAL_HOUSING, OTHER",
    }),
    __metadata("design:type", String)
], AddAnimalExpenseRecordBodyDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], AddAnimalExpenseRecordBodyDto.prototype, "expenseDate", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AddAnimalExpenseRecordBodyDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddAnimalExpenseRecordBodyDto.prototype, "notes", void 0);
//# sourceMappingURL=add-animal-expense-record-body.dto.js.map