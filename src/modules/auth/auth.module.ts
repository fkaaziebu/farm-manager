import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { AuthResolver } from "./auth.resolver";

// Entities
import {
  Admin,
  Apiary,
  AquacultureBatch,
  AquacultureSystem,
  Barn,
  BreedingRecord,
  Coop,
  CropBatch,
  ExpenseRecord,
  Farm,
  Field,
  Greenhouse,
  GrowthRecord,
  HealthRecord,
  Hive,
  Livestock,
  Pen,
  Pond,
  PoultryBatch,
  PoultryHouse,
  Report,
  Review,
  SalesRecord,
  Task,
  Worker,
} from "src/database/entities";
import { QueueModule } from "../queue/queue.module";

@Module({
  imports: [
    ConfigModule,
    QueueModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get("JWT_SECRET"),
        signOptions: {
          expiresIn: 86400,
        },
      }),
    }),
    TypeOrmModule.forFeature([
      Admin,
      Apiary,
      AquacultureBatch,
      AquacultureSystem,
      Barn,
      BreedingRecord,
      Coop,
      CropBatch,
      ExpenseRecord,
      Farm,
      Field,
      Greenhouse,
      GrowthRecord,
      HealthRecord,
      Hive,
      Livestock,
      Pen,
      Pond,
      PoultryBatch,
      PoultryHouse,
      Report,
      Review,
      SalesRecord,
      Task,
      Worker,
    ]),
  ],
  controllers: [],
  providers: [AuthService, JwtStrategy, AuthResolver],
})
export class AuthModule {}
