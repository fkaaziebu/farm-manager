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
} from "src/database/entities";
import { GroupResolver } from "./resolvers/group.resolver";
import { GroupService } from "./services/group.service";
import { QueueModule } from "../queue/queue.module";
import { CropService } from "./services/crop.service";
import { CropResolver } from "./resolvers/crop.resolver";

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
