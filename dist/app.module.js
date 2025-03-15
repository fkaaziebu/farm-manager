"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const config_schema_1 = require("./config.schema");
const auth_module_1 = require("./auth/auth.module");
const admin_entity_1 = require("./entities/admin.entity");
const animal_entity_1 = require("./entities/animal.entity");
const breeding_record_entity_1 = require("./entities/breeding-record.entity");
const expense_record_entity_1 = require("./entities/expense-record.entity");
const farm_entity_1 = require("./entities/farm.entity");
const growth_record_entity_1 = require("./entities/growth-record.entity");
const health_record_entity_1 = require("./entities/health-record.entity");
const house_entity_1 = require("./entities/house.entity");
const room_entity_1 = require("./entities/room.entity");
const sales_record_entity_1 = require("./entities/sales-record.entity");
const worker_entity_1 = require("./entities/worker.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            config_1.ConfigModule.forRoot({
                envFilePath: [
                    process.env.STAGE === "development"
                        ? `.env.${process.env.STAGE}.local`
                        : ".env",
                ],
                validationSchema: config_schema_1.configValidationSchema,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => ({
                    type: "postgres",
                    autoLoadEntities: true,
                    synchronize: configService.get("NODE_ENV") !== "production",
                    host: configService.get("DB_HOST"),
                    url: configService.get("DATABASE_URL"),
                    port: configService.get("DB_PORT"),
                    username: configService.get("DB_USERNAME"),
                    password: configService.get("DB_PASSWORD"),
                    database: configService.get("DB_DATABASE"),
                    entities: [
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
                    ],
                }),
            }),
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map