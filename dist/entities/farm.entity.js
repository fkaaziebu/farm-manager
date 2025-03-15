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
exports.Farm = void 0;
const typeorm_1 = require("typeorm");
const admin_entity_1 = require("./admin.entity");
const worker_entity_1 = require("./worker.entity");
const animal_entity_1 = require("./animal.entity");
const house_entity_1 = require("./house.entity");
let Farm = class Farm {
};
exports.Farm = Farm;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Farm.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Farm.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => admin_entity_1.Admin, (admin) => admin.farms),
    __metadata("design:type", admin_entity_1.Admin)
], Farm.prototype, "admin", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => worker_entity_1.Worker, (worker) => worker.farms),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Farm.prototype, "workers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => house_entity_1.House, (house) => house.farm),
    __metadata("design:type", Array)
], Farm.prototype, "houses", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => animal_entity_1.Animal, (animal) => animal.farm),
    __metadata("design:type", Array)
], Farm.prototype, "animals", void 0);
exports.Farm = Farm = __decorate([
    (0, typeorm_1.Entity)('farms')
], Farm);
//# sourceMappingURL=farm.entity.js.map