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
exports.CreateAnimalInput = void 0;
const graphql_1 = require("@nestjs/graphql");
var Gender;
(function (Gender) {
    Gender["MALE"] = "MALE";
    Gender["FEMALE"] = "FEMALE";
})(Gender || (Gender = {}));
(0, graphql_1.registerEnumType)(Gender, {
    name: "Gender",
});
let CreateAnimalInput = class CreateAnimalInput {
};
exports.CreateAnimalInput = CreateAnimalInput;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CreateAnimalInput.prototype, "tag_number", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], CreateAnimalInput.prototype, "birth_date", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CreateAnimalInput.prototype, "breed", void 0);
__decorate([
    (0, graphql_1.Field)(() => Gender, { nullable: false }),
    __metadata("design:type", String)
], CreateAnimalInput.prototype, "gender", void 0);
exports.CreateAnimalInput = CreateAnimalInput = __decorate([
    (0, graphql_1.InputType)()
], CreateAnimalInput);
//# sourceMappingURL=create-animal.input.js.map