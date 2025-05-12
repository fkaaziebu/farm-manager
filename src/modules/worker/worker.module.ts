import { Module } from "@nestjs/common";
import { WorkerService } from "./worker.service";
import { WorkerResolver } from "./worker.resolver";
import { ConfigModule } from "@nestjs/config";
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
      SalesRecord,
      Task,
      Worker,
      Report,
    ]),
  ],
  controllers: [],
  providers: [WorkerService, WorkerResolver],
})
export class WorkerModule {}
