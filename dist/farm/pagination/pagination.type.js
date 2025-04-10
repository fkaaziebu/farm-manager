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
exports.SortInput = exports.PaginationInput = exports.PageInfo = void 0;
exports.Paginated = Paginated;
const graphql_1 = require("@nestjs/graphql");
let PageInfo = class PageInfo {
};
exports.PageInfo = PageInfo;
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], PageInfo.prototype, "startCursor", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], PageInfo.prototype, "endCursor", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], PageInfo.prototype, "hasNextPage", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], PageInfo.prototype, "hasPreviousPage", void 0);
exports.PageInfo = PageInfo = __decorate([
    (0, graphql_1.ObjectType)()
], PageInfo);
function Paginated(classRef) {
    let EdgeType = class EdgeType {
    };
    __decorate([
        (0, graphql_1.Field)(),
        __metadata("design:type", String)
    ], EdgeType.prototype, "cursor", void 0);
    __decorate([
        (0, graphql_1.Field)(() => classRef),
        __metadata("design:type", Object)
    ], EdgeType.prototype, "node", void 0);
    EdgeType = __decorate([
        (0, graphql_1.ObjectType)(`${classRef.name}Edge`)
    ], EdgeType);
    let PaginatedType = class PaginatedType {
    };
    __decorate([
        (0, graphql_1.Field)(() => [EdgeType]),
        __metadata("design:type", Array)
    ], PaginatedType.prototype, "edges", void 0);
    __decorate([
        (0, graphql_1.Field)(),
        __metadata("design:type", PageInfo)
    ], PaginatedType.prototype, "pageInfo", void 0);
    __decorate([
        (0, graphql_1.Field)(() => graphql_1.Int),
        __metadata("design:type", Number)
    ], PaginatedType.prototype, "count", void 0);
    PaginatedType = __decorate([
        (0, graphql_1.ObjectType)({ isAbstract: true })
    ], PaginatedType);
    return PaginatedType;
}
let PaginationInput = class PaginationInput {
};
exports.PaginationInput = PaginationInput;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], PaginationInput.prototype, "first", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], PaginationInput.prototype, "after", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], PaginationInput.prototype, "last", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], PaginationInput.prototype, "before", void 0);
exports.PaginationInput = PaginationInput = __decorate([
    (0, graphql_1.InputType)()
], PaginationInput);
let SortInput = class SortInput {
};
exports.SortInput = SortInput;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], SortInput.prototype, "field", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], SortInput.prototype, "direction", void 0);
exports.SortInput = SortInput = __decorate([
    (0, graphql_1.InputType)()
], SortInput);
//# sourceMappingURL=pagination.type.js.map