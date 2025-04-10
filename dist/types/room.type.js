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
exports.RoomType = void 0;
const graphql_1 = require("@nestjs/graphql");
const house_type_1 = require("./house.type");
const animal_type_1 = require("./animal.type");
let RoomType = class RoomType {
};
exports.RoomType = RoomType;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", Number)
], RoomType.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], RoomType.prototype, "room_number", void 0);
__decorate([
    (0, graphql_1.Field)(() => house_type_1.HouseType, { nullable: true }),
    __metadata("design:type", house_type_1.HouseType)
], RoomType.prototype, "house", void 0);
__decorate([
    (0, graphql_1.Field)(() => [animal_type_1.AnimalType], { nullable: true }),
    __metadata("design:type", Array)
], RoomType.prototype, "animals", void 0);
exports.RoomType = RoomType = __decorate([
    (0, graphql_1.ObjectType)("Room")
], RoomType);
//# sourceMappingURL=room.type.js.map