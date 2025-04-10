import { Module } from "@nestjs/common";
import { FarmController } from "./farm.controller";
import { FarmService } from "./farm.service";
import { FarmResolver } from "./farm.resolver";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

// Entities
import { Admin } from "../entities/admin.entity";
import { Animal } from "../entities/animal.entity";
import { BreedingRecord } from "../entities/breeding_record.entity";
import { ExpenseRecord } from "../entities/expense_record.entity";
import { Farm } from "../entities/farm.entity";
import { GrowthRecord } from "../entities/growth_record.entity";
import { HealthRecord } from "../entities/health_record.entity";
import { House } from "../entities/house.entity";
import { Room } from "../entities/room.entity";
import { SalesRecord } from "../entities/sales_record.entity";
import { Worker } from "../entities/worker.entity";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { PaginationService } from "./pagination/pagination.service";

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      Admin,
      Animal,
      BreedingRecord,
      ExpenseRecord,
      Farm,
      GrowthRecord,
      HealthRecord,
      House,
      Room,
      SalesRecord,
      Worker,
    ]),
  ],
  controllers: [FarmController],
  providers: [FarmService, FarmResolver, JwtStrategy, PaginationService],
})
export class FarmModule {}
