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
exports.HealthRecord = void 0;
const typeorm_1 = require("typeorm");
const animal_entity_1 = require("./animal.entity");
let HealthRecord = class HealthRecord {
};
exports.HealthRecord = HealthRecord;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], HealthRecord.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], HealthRecord.prototype, "issue", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], HealthRecord.prototype, "symptoms", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], HealthRecord.prototype, "diagnosis", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], HealthRecord.prototype, "medication", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], HealthRecord.prototype, "vet_name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], HealthRecord.prototype, "cost", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], HealthRecord.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => animal_entity_1.Animal, (animal) => animal.health_records),
    __metadata("design:type", animal_entity_1.Animal)
], HealthRecord.prototype, "animal", void 0);
exports.HealthRecord = HealthRecord = __decorate([
    (0, typeorm_1.Entity)("health_records")
], HealthRecord);
//# sourceMappingURL=health_record.entity.js.map