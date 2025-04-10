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
exports.GrowthRecord = exports.GrowthPeriod = void 0;
const typeorm_1 = require("typeorm");
const animal_entity_1 = require("./animal.entity");
var GrowthPeriod;
(function (GrowthPeriod) {
    GrowthPeriod["BIRTH"] = "BIRTH";
    GrowthPeriod["FOUR_WEEKS"] = "4_WEEKS";
    GrowthPeriod["EIGHT_WEEKS"] = "8_WEEKS";
    GrowthPeriod["ADULTHOOD"] = "ADULTHOOD";
})(GrowthPeriod || (exports.GrowthPeriod = GrowthPeriod = {}));
let GrowthRecord = class GrowthRecord {
};
exports.GrowthRecord = GrowthRecord;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], GrowthRecord.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: GrowthPeriod,
    }),
    __metadata("design:type", String)
], GrowthRecord.prototype, "period", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: null }),
    __metadata("design:type", Number)
], GrowthRecord.prototype, "growth_rate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GrowthRecord.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => animal_entity_1.Animal, (animal) => animal.growth_records),
    __metadata("design:type", animal_entity_1.Animal)
], GrowthRecord.prototype, "animal", void 0);
exports.GrowthRecord = GrowthRecord = __decorate([
    (0, typeorm_1.Entity)("growth_records")
], GrowthRecord);
//# sourceMappingURL=growth_record.entity.js.map