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
exports.Animal = void 0;
const typeorm_1 = require("typeorm");
const farm_entity_1 = require("./farm.entity");
const breeding_record_entity_1 = require("./breeding-record.entity");
const growth_record_entity_1 = require("./growth-record.entity");
const expense_record_entity_1 = require("./expense-record.entity");
const health_record_entity_1 = require("./health-record.entity");
const sales_record_entity_1 = require("./sales-record.entity");
const room_entity_1 = require("./room.entity");
let Animal = class Animal {
};
exports.Animal = Animal;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", String)
], Animal.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Animal.prototype, "tag_number", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Animal.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Animal.prototype, "birth_date", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Animal.prototype, "breed", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Animal.prototype, "weight", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'HEALTHY' }),
    __metadata("design:type", String)
], Animal.prototype, "health_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Animal.prototype, "available", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Animal, (animal) => animal.direct_children),
    __metadata("design:type", Array)
], Animal.prototype, "direct_parents", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Animal, (animal) => animal.direct_parents),
    __metadata("design:type", Array)
], Animal.prototype, "direct_children", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => farm_entity_1.Farm, (farm) => farm.animals),
    __metadata("design:type", farm_entity_1.Farm)
], Animal.prototype, "farm", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => room_entity_1.Room, (room) => room.animals),
    __metadata("design:type", room_entity_1.Room)
], Animal.prototype, "room", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => breeding_record_entity_1.BreedingRecord, (breeding_record) => breeding_record.animals),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Animal.prototype, "breeding_records", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => growth_record_entity_1.GrowthRecord, (growth_record) => growth_record.animal),
    __metadata("design:type", Array)
], Animal.prototype, "growth_records", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => expense_record_entity_1.ExpenseRecord, (expense_record) => expense_record.animal),
    __metadata("design:type", Array)
], Animal.prototype, "expense_records", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => health_record_entity_1.HealthRecord, (health_record) => health_record.animal),
    __metadata("design:type", Array)
], Animal.prototype, "health_records", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => sales_record_entity_1.SalesRecord, (sales_record) => sales_record.animal),
    __metadata("design:type", sales_record_entity_1.SalesRecord)
], Animal.prototype, "sales_record", void 0);
exports.Animal = Animal = __decorate([
    (0, typeorm_1.Entity)('animals')
], Animal);
//# sourceMappingURL=animal.entity.js.map