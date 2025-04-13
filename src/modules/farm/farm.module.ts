import { Module } from "@nestjs/common";
import { FarmService } from "./farm.service";
import { FarmResolver } from "./farm.resolver";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtStrategy } from "./strategies/jwt.strategy";

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
  HousingUnit,
  Livestock,
  Pen,
  Pond,
  PoultryBatch,
  PoultryHouse,
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
      HousingUnit,
      Livestock,
      Pen,
      Pond,
      PoultryBatch,
      PoultryHouse,
      SalesRecord,
      Task,
      Worker,
    ]),
  ],
  controllers: [],
  providers: [FarmService, FarmResolver, JwtStrategy],
})
export class FarmModule {}
