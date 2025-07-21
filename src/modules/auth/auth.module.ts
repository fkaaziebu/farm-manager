import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { AuthResolver } from "./auth.resolver";
import { GoogleStrategy } from "./strategies/google.strategy";

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
  Group,
  GrowthRecord,
  HealthRecord,
  Hive,
  Livestock,
  Pen,
  Pond,
  PoultryBatch,
  PoultryHouse,
  Report,
  Request,
  Review,
  SalesRecord,
  Task,
  Worker,
  Prediction,
  Feedback,
  LeafDetection,
} from "src/database/entities";
import { QueueModule } from "../queue/queue.module";
import { AuthController } from "./auth.controller";

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
      Group,
      GrowthRecord,
      HealthRecord,
      Hive,
      Livestock,
      Pen,
      Pond,
      PoultryBatch,
      PoultryHouse,
      Report,
      Request,
      Review,
      SalesRecord,
      Task,
      Worker,
      Prediction,
      Feedback,
      LeafDetection,
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, AuthResolver, GoogleStrategy],
})
export class AuthModule {}
