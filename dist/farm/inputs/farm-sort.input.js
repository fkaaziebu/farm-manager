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
exports.FarmSortInput = void 0;
const graphql_1 = require("@nestjs/graphql");
var SortDirection;
(function (SortDirection) {
    SortDirection["ASC"] = "ASC";
    SortDirection["DESC"] = "DESC";
})(SortDirection || (SortDirection = {}));
(0, graphql_1.registerEnumType)(SortDirection, {
    name: "SortDirection",
});
var FarmSortField;
(function (FarmSortField) {
    FarmSortField["ID"] = "id";
    FarmSortField["NAME"] = "name";
    FarmSortField["INSERTED_AT"] = "insertedAt";
})(FarmSortField || (FarmSortField = {}));
(0, graphql_1.registerEnumType)(FarmSortField, {
    name: "FarmSortField",
});
let FarmSortInput = class FarmSortInput {
};
exports.FarmSortInput = FarmSortInput;
__decorate([
    (0, graphql_1.Field)(() => FarmSortField),
    __metadata("design:type", String)
], FarmSortInput.prototype, "field", void 0);
__decorate([
    (0, graphql_1.Field)(() => SortDirection),
    __metadata("design:type", String)
], FarmSortInput.prototype, "direction", void 0);
exports.FarmSortInput = FarmSortInput = __decorate([
    (0, graphql_1.InputType)()
], FarmSortInput);
//# sourceMappingURL=farm-sort.input.js.map