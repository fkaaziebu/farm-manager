import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
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
  Feedback,
  Field,
  Greenhouse,
  Group,
  GrowthRecord,
  HealthRecord,
  Hive,
  Iam,
  LeafDetection,
  Livestock,
  Pen,
  Pond,
  PoultryBatch,
  PoultryHouse,
  Prediction,
  Report,
  Request,
  Review,
  SalesRecord,
  Task,
  Worker,
} from "src/database/entities";
import { QueueModule } from "../queue/queue.module";
import { AuthController } from "./auth.controller";
import { AuthResolver } from "./auth.resolver";
import { AuthService } from "./auth.service";
import { AdminResolver } from "./resolvers/admin.resolver";
import { WorkerResolver } from "./resolvers/worker.resolver";
import { AdminService } from "./services/admin.service";
import { WorkerService } from "./services/worker.service";
import { GoogleStrategy } from "./strategies/google.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";

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
      Iam,
    ]),
  ],
  controllers: [AuthController],
  providers: [
    WorkerService,
    WorkerResolver,
    AdminService,
    AdminResolver,
    AuthService,
    JwtStrategy,
    AuthResolver,
    GoogleStrategy,
  ],
})
export class AuthModule {}
