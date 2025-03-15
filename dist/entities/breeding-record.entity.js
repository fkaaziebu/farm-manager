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
exports.BreedingRecord = void 0;
const typeorm_1 = require("typeorm");
const animal_entity_1 = require("./animal.entity");
let BreedingRecord = class BreedingRecord {
};
exports.BreedingRecord = BreedingRecord;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", String)
], BreedingRecord.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], BreedingRecord.prototype, "mating_date", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], BreedingRecord.prototype, "expected_delivery", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], BreedingRecord.prototype, "actual_delivery", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], BreedingRecord.prototype, "liter_size", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BreedingRecord.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => animal_entity_1.Animal, (animal) => animal.breeding_records),
    __metadata("design:type", animal_entity_1.Animal)
], BreedingRecord.prototype, "male", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => animal_entity_1.Animal, (animal) => animal.breeding_records),
    __metadata("design:type", animal_entity_1.Animal)
], BreedingRecord.prototype, "female", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => animal_entity_1.Animal, (animal) => animal.breeding_records),
    __metadata("design:type", Array)
], BreedingRecord.prototype, "animals", void 0);
exports.BreedingRecord = BreedingRecord = __decorate([
    (0, typeorm_1.Entity)('breeding-records')
], BreedingRecord);
//# sourceMappingURL=breeding-record.entity.js.map