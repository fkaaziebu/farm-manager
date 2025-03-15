import { Test, type TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { ConfigModule, ConfigService } from "@nestjs/config";
import type { CreateAdminBodyDto } from "./dto/create-admin-body.dto";
import { AuthService } from "./auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";

// Entities
import { Admin } from "../entities/admin.entity";
import { Animal } from "../entities/animal.entity";
import { BreedingRecord } from "../entities/breeding-record.entity";
import { ExpenseRecord } from "../entities/expense-record.entity";
import { Farm } from "../entities/farm.entity";
import { GrowthRecord } from "../entities/growth-record.entity";
import { HealthRecord } from "../entities/health-record.entity";
import { House } from "../entities/house.entity";
import { Room } from "../entities/room.entity";
import { SalesRecord } from "../entities/sales-record.entity";
import { Worker } from "../entities/worker.entity";

describe("AuthController", () => {
  let authController: AuthController;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: ".env.test.local",
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            type: "postgres",
            host: configService.get("DB_HOST"),
            port: configService.get("DB_PORT"),
            username: configService.get("DB_USERNAME"),
            password: configService.get("DB_PASSWORD"),
            database: configService.get("DB_DATABASE_TEST"),
            entities: [
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
            ],
            synchronize: true,
          }),
          inject: [ConfigService],
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
      providers: [AuthService],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  beforeEach(async () => {});

  afterAll(async () => {
    await module.close();
  });

  const createAdminBodyDto: CreateAdminBodyDto = {
    name: "Frederick Aziebu",
    email: "frederickaziebu1998@gmail.com",
    password: "Microsoft@2021",
  };

  describe("createAdminAccount", () => {
    it("returns success when admin registers successfully", async () => {
      const response =
        await authController.createAdminAccount(createAdminBodyDto);

      expect(response.message).toBe("Admin created successfully");
    });
  });
});
