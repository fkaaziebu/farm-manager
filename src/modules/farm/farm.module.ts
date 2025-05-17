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
  Review,
  SalesRecord,
  Task,
  Worker,
} from "src/database/entities";
import { GroupResolver } from "./resolvers/group.resolver";
import { GroupService } from "./services/group.service";

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
    JwtStrategy,
  ],
})
export class FarmModule {}
