"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const queue_module_1 = require("../queue/queue.module");
const admin_entity_1 = require("../entities/admin.entity");
const animal_entity_1 = require("../entities/animal.entity");
const breeding_record_entity_1 = require("../entities/breeding_record.entity");
const expense_record_entity_1 = require("../entities/expense_record.entity");
const farm_entity_1 = require("../entities/farm.entity");
const growth_record_entity_1 = require("../entities/growth_record.entity");
const health_record_entity_1 = require("../entities/health_record.entity");
const house_entity_1 = require("../entities/house.entity");
const room_entity_1 = require("../entities/room.entity");
const sales_record_entity_1 = require("../entities/sales_record.entity");
const worker_entity_1 = require("../entities/worker.entity");
const auth_resolver_1 = require("./auth.resolver");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            queue_module_1.QueueModule,
            config_1.ConfigModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => ({
                    secret: configService.get("JWT_SECRET"),
                    signOptions: {
                        expiresIn: 86400,
                    },
                }),
            }),
            typeorm_1.TypeOrmModule.forFeature([
                admin_entity_1.Admin,
                animal_entity_1.Animal,
                breeding_record_entity_1.BreedingRecord,
                expense_record_entity_1.ExpenseRecord,
                farm_entity_1.Farm,
                growth_record_entity_1.GrowthRecord,
                health_record_entity_1.HealthRecord,
                house_entity_1.House,
                room_entity_1.Room,
                sales_record_entity_1.SalesRecord,
                worker_entity_1.Worker,
            ]),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy, auth_resolver_1.AuthResolver],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map