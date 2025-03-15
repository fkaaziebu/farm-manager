import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { configValidationSchema } from "./config.schema";
import { AuthModule } from "./auth/auth.module";

// Entities
import { Admin } from "./entities/admin.entity";
import { Animal } from "./entities/animal.entity";
import { BreedingRecord } from "./entities/breeding-record.entity";
import { ExpenseRecord } from "./entities/expense-record.entity";
import { Farm } from "./entities/farm.entity";
import { GrowthRecord } from "./entities/growth-record.entity";
import { HealthRecord } from "./entities/health-record.entity";
import { House } from "./entities/house.entity";
import { Room } from "./entities/room.entity";
import { SalesRecord } from "./entities/sales-record.entity";
import { Worker } from "./entities/worker.entity";

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: [
        process.env.STAGE === "development"
          ? `.env.${process.env.STAGE}.local`
          : ".env",
      ],
      validationSchema: configValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
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
          Admin,
          Animal,
          BreedingRecord,
          ExpenseRecord,
          Farm,
          GrowthRecord,
          HealthRecord,
          House,
          Room,
          SalesRecord,
          Worker,
        ],
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
