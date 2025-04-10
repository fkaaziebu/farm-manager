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
exports.HouseType = void 0;
const graphql_1 = require("@nestjs/graphql");
const room_type_1 = require("./room.type");
const farm_type_1 = require("./farm.type");
const house_entity_1 = require("../entities/house.entity");
(0, graphql_1.registerEnumType)(house_entity_1.HouseStatus, {
    name: "HouseStatus",
});
let HouseType = class HouseType {
};
exports.HouseType = HouseType;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", Number)
], HouseType.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], HouseType.prototype, "house_number", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], HouseType.prototype, "type", void 0);
__decorate([
    (0, graphql_1.Field)(() => house_entity_1.HouseStatus),
    __metadata("design:type", String)
], HouseType.prototype, "status", void 0);
__decorate([
    (0, graphql_1.Field)(() => farm_type_1.FarmType, { nullable: true }),
    __metadata("design:type", farm_type_1.FarmType)
], HouseType.prototype, "farm", void 0);
__decorate([
    (0, graphql_1.Field)(() => [room_type_1.RoomType], { nullable: true }),
    __metadata("design:type", Array)
], HouseType.prototype, "rooms", void 0);
exports.HouseType = HouseType = __decorate([
    (0, graphql_1.ObjectType)("House")
], HouseType);
//# sourceMappingURL=house.type.js.map