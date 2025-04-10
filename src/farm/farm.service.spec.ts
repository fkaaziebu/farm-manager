import { Test, TestingModule } from "@nestjs/testing";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { FarmService } from "./farm.service";
import { Connection, Repository } from "typeorm";
import { JwtModule } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { FarmController } from "./farm.controller";
import { PaginationService } from "./pagination/pagination.service";
import { BadRequestException } from "@nestjs/common";

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
import { Worker, WorkerRole } from "../entities/worker.entity";

describe("FarmService", () => {
  let farmService: FarmService;
  let module: TestingModule;
  let connection: Connection;
  let adminRepository: Repository<Admin>;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: ".env.test.local",
        }),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>("JWT_SECRET"),
            secretOrPrivateKey: configService.get("JWT_SECRET"),
            signOptions: { expiresIn: "1h" },
          }),
          inject: [ConfigService],
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
      controllers: [FarmController],
      providers: [FarmService, PaginationService],
    }).compile();

    connection = module.get<Connection>(Connection);
    farmService = module.get<FarmService>(FarmService);
    adminRepository = module.get<Repository<Admin>>(getRepositoryToken(Admin));
  });

  beforeEach(async () => {
    // Clear the database before each test
    const entities = connection.entityMetadatas;
    for (const entity of entities) {
      const repository = connection.getRepository(entity.name);
      await repository.query(`TRUNCATE "${entity.tableName}" CASCADE;`);
    }
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await connection.close();
    await module.close();
  });

  const adminInfo = {
    name: "Frederick Aziebu",
    email: "frederickaziebu1998@gmail.com",
    password: "Microsoft@2021",
  };

  const createAdminAccount = async (
    email = adminInfo.email,
    worker1Email = "frederickaziebu1998@gmail.com",
    worker2Email = "fkaaziebu1998@gmail.com",
  ) => {
    await adminRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const user = new Admin();
        user.name = adminInfo.name;
        user.email = email;
        const saltRounds = 10; // You can adjust this for stronger hashing
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(adminInfo.password, salt);
        user.password = hash;

        const worker1 = new Worker();
        const worker2 = new Worker();

        worker1.name = "fk1";
        worker1.email = worker1Email;
        worker1.password = await bcrypt.hash(adminInfo.password, salt);
        worker2.name = "fk2";
        worker2.email = worker2Email;
        worker2.password = await bcrypt.hash(adminInfo.password, salt);

        user.workers = [worker1, worker2];
        await transactionalEntityManager.save(Worker, worker1);
        await transactionalEntityManager.save(Worker, worker2);
        await transactionalEntityManager.save(Admin, user);
      },
    );
  };

  const getAdminFarms = async (email = adminInfo.email) => {
    const admin = await adminRepository.findOne({
      where: {
        email,
      },
      relations: [
        "farms.workers",
        "farms.houses.rooms",
        "farms.animals.expense_records",
        "farms.animals.growth_records",
        "farms.animals.health_records",
        "farms.animals.sales_record",
        "farms.animals.breeding_records.animals",
      ],
    });

    return admin.farms;
  };

  const getAdminWorkers = async (email = adminInfo.email) => {
    const admin = await adminRepository.findOne({
      where: {
        email,
      },
      relations: ["workers"],
    });

    return admin.workers;
  };

  describe("CreateFarm", () => {
    it("returns success when admin creates a farm", async () => {
      await createAdminAccount();

      const response = await farmService.createFarm({
        name: "Frederick Farms 1",
        email: adminInfo.email,
        location: "Farm Location",
        area: "20 Acres",
      });

      expect(response.message).toBe("Farm created successfully");

      const adminFarms = await getAdminFarms();
      expect(adminFarms.length).toEqual(1);
      expect(adminFarms[0].name).toBe("Frederick Farms 1");
    });

    it("throws an error if name of farm already used", async () => {
      await createAdminAccount(); // default admin
      await createAdminAccount(
        "fkaaziebu1998@gmail.com",
        "fkaaziebu2008@gmail.com",
        "fkaaziebu2009@gmail.com",
      ); // second admin

      const response = await farmService.createFarm({
        name: "Frederick Farms 1",
        email: adminInfo.email,
        location: "Farm Location",
        area: "20 Acres",
      });

      await expect(
        farmService.createFarm({
          name: "Frederick Farms 1",
          email: adminInfo.email,
          location: "Farm Location",
          area: "20 Acres",
        }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        farmService.createFarm({
          name: "Frederick Farms 1",
          email: adminInfo.email,
          location: "Farm Location",
          area: "20 Acres",
        }),
      ).rejects.toThrow("This name is already in use");

      await expect(
        farmService.createFarm({
          name: "Frederick Farms 1",
          email: "fkaaziebu1998@gmail.com",
          location: "Farm Location",
          area: "20 Acres",
        }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        farmService.createFarm({
          name: "Frederick Farms 1",
          email: "fkaaziebu1998@gmail.com",
          location: "Farm Location",
          area: "20 Acres",
        }),
      ).rejects.toThrow("This name is already in use");
    });
  });

  describe("ListFarm", () => {
    it("retuns list of farms belonging to admin", async () => {
      await createAdminAccount();

      await farmService.createFarm({
        name: "Frederick Farms 1",
        email: adminInfo.email,
        location: "Farm Location",
        area: "20 Acres",
      });

      await farmService.createFarm({
        name: "Frederick Farms 2",
        email: adminInfo.email,
        location: "Farm Location",
        area: "20 Acres",
      });

      const response = await farmService.listFarmsPaginated({
        email: adminInfo.email,
        role: "ADMIN",
        pagination: {},
      });

      expect(response.edges.length).toEqual(2);
    });
  });

  describe("AddFarmWorkers", () => {
    it("returns success when admin adds workers to farm", async () => {
      await createAdminAccount();
      const adminWorkers = await getAdminWorkers(adminInfo.email);

      const farm = await farmService.createFarm({
        name: "Frederick Farms 1",
        email: adminInfo.email,
        location: "Farm Location",
        area: "20 Acres",
      });

      const response = await farmService.addFarmWorkers({
        farmId: `${farm.id}`,
        workerIds: adminWorkers.map((wk) => ({ id: wk.id })),
        email: adminInfo.email,
      });

      expect(response.message).toBe(
        `${adminWorkers.length} out of ${adminWorkers.length} Worker(s) added to farm successfully`,
      );

      const adminFarms = await getAdminFarms();
      expect(adminFarms[0].workers.length).toEqual(2);
    });
  });

  describe("CreateAndAddWorkerToFarm", () => {
    it("returns success when admin creates and adds workers to farm", async () => {
      await createAdminAccount();

      const farm = await farmService.createFarm({
        name: "Frederick Farms 1",
        email: adminInfo.email,
        location: "Farm Location",
        area: "20 Acres",
      });

      const createdWorkers = await farmService.createWorkers({
        workers: [
          {
            name: "Fred Aziebu",
            email: "fkaaziebu1999@gmail.com",
            role: WorkerRole.FARM_MANAGER,
            password: "1234",
          },
        ],
        email: adminInfo.email,
      });

      const response = await farmService.addFarmWorkers({
        farmId: `${farm.id}`,
        workerIds: createdWorkers.workerIds,
        email: adminInfo.email,
      });

      expect(response.message).toBe(
        `${createdWorkers.workerIds.length} out of ${createdWorkers.workerIds.length} Worker(s) added to farm successfully`,
      );

      const adminFarms = await getAdminFarms();
      expect(adminFarms[0].workers.length).toEqual(1);
    });
  });
});
