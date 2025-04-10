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
exports.HouseSortInput = void 0;
const graphql_1 = require("@nestjs/graphql");
var HouseSortDirection;
(function (HouseSortDirection) {
    HouseSortDirection["ASC"] = "ASC";
    HouseSortDirection["DESC"] = "DESC";
})(HouseSortDirection || (HouseSortDirection = {}));
(0, graphql_1.registerEnumType)(HouseSortDirection, {
    name: "HouseSortDirection",
});
var HouseSortField;
(function (HouseSortField) {
    HouseSortField["ID"] = "id";
    HouseSortField["NAME"] = "name";
    HouseSortField["INSERTED_AT"] = "insertedAt";
})(HouseSortField || (HouseSortField = {}));
(0, graphql_1.registerEnumType)(HouseSortField, {
    name: "HouseSortField",
});
let HouseSortInput = class HouseSortInput {
};
exports.HouseSortInput = HouseSortInput;
__decorate([
    (0, graphql_1.Field)(() => HouseSortField),
    __metadata("design:type", String)
], HouseSortInput.prototype, "field", void 0);
__decorate([
    (0, graphql_1.Field)(() => HouseSortDirection),
    __metadata("design:type", String)
], HouseSortInput.prototype, "direction", void 0);
exports.HouseSortInput = HouseSortInput = __decorate([
    (0, graphql_1.InputType)()
], HouseSortInput);
//# sourceMappingURL=house-sort.input.js.map