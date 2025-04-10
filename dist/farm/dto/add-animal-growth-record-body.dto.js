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
exports.AddAnimalGrowthRecordBodyDto = void 0;
const class_validator_1 = require("class-validator");
const growth_record_entity_1 = require("../../entities/growth_record.entity");
class AddAnimalGrowthRecordBodyDto {
}
exports.AddAnimalGrowthRecordBodyDto = AddAnimalGrowthRecordBodyDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(growth_record_entity_1.GrowthPeriod, {
        message: "Period must be one of: BIRTH, 4_WEEKS, 8_WEEKS, ADULTHOOD",
    }),
    __metadata("design:type", String)
], AddAnimalGrowthRecordBodyDto.prototype, "period", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AddAnimalGrowthRecordBodyDto.prototype, "growthRate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddAnimalGrowthRecordBodyDto.prototype, "notes", void 0);
//# sourceMappingURL=add-animal-growth-record-body.dto.js.map