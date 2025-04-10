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
exports.WorkerSortInput = void 0;
const graphql_1 = require("@nestjs/graphql");
var WorkerSortDirection;
(function (WorkerSortDirection) {
    WorkerSortDirection["ASC"] = "ASC";
    WorkerSortDirection["DESC"] = "DESC";
})(WorkerSortDirection || (WorkerSortDirection = {}));
(0, graphql_1.registerEnumType)(WorkerSortDirection, {
    name: "WorkerSortDirection",
});
var WorkerSortField;
(function (WorkerSortField) {
    WorkerSortField["ID"] = "id";
    WorkerSortField["NAME"] = "name";
    WorkerSortField["INSERTED_AT"] = "insertedAt";
})(WorkerSortField || (WorkerSortField = {}));
(0, graphql_1.registerEnumType)(WorkerSortField, {
    name: "WorkerSortField",
});
let WorkerSortInput = class WorkerSortInput {
};
exports.WorkerSortInput = WorkerSortInput;
__decorate([
    (0, graphql_1.Field)(() => WorkerSortField),
    __metadata("design:type", String)
], WorkerSortInput.prototype, "field", void 0);
__decorate([
    (0, graphql_1.Field)(() => WorkerSortDirection),
    __metadata("design:type", String)
], WorkerSortInput.prototype, "direction", void 0);
exports.WorkerSortInput = WorkerSortInput = __decorate([
    (0, graphql_1.InputType)()
], WorkerSortInput);
//# sourceMappingURL=worker-sort.input.js.map