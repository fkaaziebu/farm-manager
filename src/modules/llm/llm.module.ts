import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LlmResolver } from "./llm.resolver";
import { LlmService } from "./llm.service";
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
} from "src/database/entities";
import { CacheModule } from "@nestjs/cache-manager";

@Module({
  imports: [
    ConfigModule,
    CacheModule.register(),
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
    ]),
  ],
  controllers: [],
  providers: [LlmService, LlmResolver, JwtStrategy],
})
export class LlmModule {}
