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

@Module({
  imports: [
    ConfigModule,
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
  providers: [LlmService, LlmResolver, JwtStrategy],
})
export class LlmModule {}
