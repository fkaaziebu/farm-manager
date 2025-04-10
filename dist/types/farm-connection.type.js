"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FarmConnection = void 0;
const graphql_1 = require("@nestjs/graphql");
const farm_type_1 = require("./farm.type");
const pagination_type_1 = require("../farm/pagination/pagination.type");
let FarmConnection = class FarmConnection extends (0, pagination_type_1.Paginated)(farm_type_1.FarmType) {
};
exports.FarmConnection = FarmConnection;
exports.FarmConnection = FarmConnection = __decorate([
    (0, graphql_1.ObjectType)("FarmConnection")
], FarmConnection);
//# sourceMappingURL=farm-connection.type.js.map