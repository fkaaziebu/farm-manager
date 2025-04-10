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
exports.FarmFilterInput = exports.AnimalFilterInput = exports.RoomFilterInput = exports.HouseFilterInput = exports.WorkerFilterInput = exports.AdminFilterInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const int_filter_input_1 = require("./int-filter.input");
const string_filter_input_1 = require("./string-filter.input");
const boolean_filter_input_1 = require("./boolean-filter.input");
const date_filter_input_1 = require("./date-filter.input");
let AdminFilterInput = class AdminFilterInput {
};
exports.AdminFilterInput = AdminFilterInput;
__decorate([
    (0, graphql_1.Field)(() => int_filter_input_1.IntFilterInput, { nullable: true }),
    __metadata("design:type", int_filter_input_1.IntFilterInput)
], AdminFilterInput.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => string_filter_input_1.StringFilterInput, { nullable: true }),
    __metadata("design:type", string_filter_input_1.StringFilterInput)
], AdminFilterInput.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(() => string_filter_input_1.StringFilterInput, { nullable: true }),
    __metadata("design:type", string_filter_input_1.StringFilterInput)
], AdminFilterInput.prototype, "email", void 0);
exports.AdminFilterInput = AdminFilterInput = __decorate([
    (0, graphql_1.InputType)()
], AdminFilterInput);
let WorkerFilterInput = class WorkerFilterInput {
};
exports.WorkerFilterInput = WorkerFilterInput;
__decorate([
    (0, graphql_1.Field)(() => int_filter_input_1.IntFilterInput, { nullable: true }),
    __metadata("design:type", int_filter_input_1.IntFilterInput)
], WorkerFilterInput.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => string_filter_input_1.StringFilterInput, { nullable: true }),
    __metadata("design:type", string_filter_input_1.StringFilterInput)
], WorkerFilterInput.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(() => string_filter_input_1.StringFilterInput, { nullable: true }),
    __metadata("design:type", string_filter_input_1.StringFilterInput)
], WorkerFilterInput.prototype, "email", void 0);
exports.WorkerFilterInput = WorkerFilterInput = __decorate([
    (0, graphql_1.InputType)()
], WorkerFilterInput);
let HouseFilterInput = class HouseFilterInput {
};
exports.HouseFilterInput = HouseFilterInput;
__decorate([
    (0, graphql_1.Field)(() => int_filter_input_1.IntFilterInput, { nullable: true }),
    __metadata("design:type", int_filter_input_1.IntFilterInput)
], HouseFilterInput.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => string_filter_input_1.StringFilterInput, { nullable: true }),
    __metadata("design:type", string_filter_input_1.StringFilterInput)
], HouseFilterInput.prototype, "house_number", void 0);
exports.HouseFilterInput = HouseFilterInput = __decorate([
    (0, graphql_1.InputType)()
], HouseFilterInput);
let RoomFilterInput = class RoomFilterInput {
};
exports.RoomFilterInput = RoomFilterInput;
__decorate([
    (0, graphql_1.Field)(() => int_filter_input_1.IntFilterInput, { nullable: true }),
    __metadata("design:type", int_filter_input_1.IntFilterInput)
], RoomFilterInput.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => string_filter_input_1.StringFilterInput, { nullable: true }),
    __metadata("design:type", string_filter_input_1.StringFilterInput)
], RoomFilterInput.prototype, "room_number", void 0);
exports.RoomFilterInput = RoomFilterInput = __decorate([
    (0, graphql_1.InputType)()
], RoomFilterInput);
let AnimalFilterInput = class AnimalFilterInput {
};
exports.AnimalFilterInput = AnimalFilterInput;
__decorate([
    (0, graphql_1.Field)(() => int_filter_input_1.IntFilterInput, { nullable: true }),
    __metadata("design:type", int_filter_input_1.IntFilterInput)
], AnimalFilterInput.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => string_filter_input_1.StringFilterInput, { nullable: true }),
    __metadata("design:type", string_filter_input_1.StringFilterInput)
], AnimalFilterInput.prototype, "tag_number", void 0);
__decorate([
    (0, graphql_1.Field)(() => string_filter_input_1.StringFilterInput, { nullable: true }),
    __metadata("design:type", string_filter_input_1.StringFilterInput)
], AnimalFilterInput.prototype, "gender", void 0);
__decorate([
    (0, graphql_1.Field)(() => date_filter_input_1.DateFilterInput, { nullable: true }),
    __metadata("design:type", date_filter_input_1.DateFilterInput)
], AnimalFilterInput.prototype, "birth_date", void 0);
__decorate([
    (0, graphql_1.Field)(() => string_filter_input_1.StringFilterInput, { nullable: true }),
    __metadata("design:type", string_filter_input_1.StringFilterInput)
], AnimalFilterInput.prototype, "breed", void 0);
__decorate([
    (0, graphql_1.Field)(() => int_filter_input_1.IntFilterInput, { nullable: true }),
    __metadata("design:type", int_filter_input_1.IntFilterInput)
], AnimalFilterInput.prototype, "weight", void 0);
__decorate([
    (0, graphql_1.Field)(() => string_filter_input_1.StringFilterInput, { nullable: true }),
    __metadata("design:type", string_filter_input_1.StringFilterInput)
], AnimalFilterInput.prototype, "health_status", void 0);
__decorate([
    (0, graphql_1.Field)(() => boolean_filter_input_1.BooleanFilterInput, { nullable: true }),
    __metadata("design:type", boolean_filter_input_1.BooleanFilterInput)
], AnimalFilterInput.prototype, "available", void 0);
exports.AnimalFilterInput = AnimalFilterInput = __decorate([
    (0, graphql_1.InputType)()
], AnimalFilterInput);
let FarmFilterInput = class FarmFilterInput {
};
exports.FarmFilterInput = FarmFilterInput;
__decorate([
    (0, graphql_1.Field)(() => int_filter_input_1.IntFilterInput, { nullable: true }),
    __metadata("design:type", int_filter_input_1.IntFilterInput)
], FarmFilterInput.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => string_filter_input_1.StringFilterInput, { nullable: true }),
    __metadata("design:type", string_filter_input_1.StringFilterInput)
], FarmFilterInput.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(() => AdminFilterInput, { nullable: true }),
    __metadata("design:type", AdminFilterInput)
], FarmFilterInput.prototype, "admin", void 0);
__decorate([
    (0, graphql_1.Field)(() => WorkerFilterInput, { nullable: true }),
    __metadata("design:type", WorkerFilterInput)
], FarmFilterInput.prototype, "worker", void 0);
__decorate([
    (0, graphql_1.Field)(() => HouseFilterInput, { nullable: true }),
    __metadata("design:type", HouseFilterInput)
], FarmFilterInput.prototype, "house", void 0);
__decorate([
    (0, graphql_1.Field)(() => AnimalFilterInput, { nullable: true }),
    __metadata("design:type", AnimalFilterInput)
], FarmFilterInput.prototype, "animal", void 0);
__decorate([
    (0, graphql_1.Field)(() => int_filter_input_1.IntFilterInput, { nullable: true }),
    __metadata("design:type", int_filter_input_1.IntFilterInput)
], FarmFilterInput.prototype, "houseCount", void 0);
__decorate([
    (0, graphql_1.Field)(() => int_filter_input_1.IntFilterInput, { nullable: true }),
    __metadata("design:type", int_filter_input_1.IntFilterInput)
], FarmFilterInput.prototype, "animalCount", void 0);
__decorate([
    (0, graphql_1.Field)(() => int_filter_input_1.IntFilterInput, { nullable: true }),
    __metadata("design:type", int_filter_input_1.IntFilterInput)
], FarmFilterInput.prototype, "workerCount", void 0);
exports.FarmFilterInput = FarmFilterInput = __decorate([
    (0, graphql_1.InputType)()
], FarmFilterInput);
//# sourceMappingURL=farm-filters.input.js.map