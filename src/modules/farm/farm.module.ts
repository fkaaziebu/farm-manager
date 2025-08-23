import { Module } from "@nestjs/common";
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
  Feedback,
  Field,
  Greenhouse,
  Group,
  GrowthRecord,
  HealthRecord,
  Hive,
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
import { FarmResolver } from "./farm.resolver";
import { FarmService } from "./farm.service";
import { CropResolver } from "./resolvers/crop.resolver";
import { GroupResolver } from "./resolvers/group.resolver";
import { CropService } from "./services/crop.service";
import { GroupService } from "./services/group.service";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
  imports: [
    ConfigModule,
    QueueModule,
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
  controllers: [],
  providers: [
    FarmService,
    GroupService,
    FarmResolver,
    GroupResolver,
    CropService,
    CropResolver,
    JwtStrategy,
  ],
})
export class FarmModule {}
