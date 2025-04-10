import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { QueueModule } from "src/queue/queue.module";

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
import { AuthResolver } from "./auth.resolver";

@Module({
  imports: [
    QueueModule,
    ConfigModule,
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
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, AuthResolver],
})
export class AuthModule {}
