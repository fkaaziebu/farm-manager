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
exports.SalesRecord = void 0;
const typeorm_1 = require("typeorm");
const animal_entity_1 = require("./animal.entity");
let SalesRecord = class SalesRecord {
};
exports.SalesRecord = SalesRecord;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", String)
], SalesRecord.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SalesRecord.prototype, "buyer_name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], SalesRecord.prototype, "sale_date", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SalesRecord.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SalesRecord.prototype, "expenses", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SalesRecord.prototype, "profit", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SalesRecord.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => animal_entity_1.Animal, (animal) => animal.sales_record),
    __metadata("design:type", animal_entity_1.Animal)
], SalesRecord.prototype, "animal", void 0);
exports.SalesRecord = SalesRecord = __decorate([
    (0, typeorm_1.Entity)('sales-records')
], SalesRecord);
//# sourceMappingURL=sales-record.entity.js.map