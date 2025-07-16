import { Test, TestingModule } from "@nestjs/testing";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { FarmService } from "./farm.service";
import { Connection, Repository } from "typeorm";
import { JwtModule } from "@nestjs/jwt";
import { HashHelper } from "../../helpers";

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
  SalesRecord,
  Task,
  Worker,
  Report,
  Request,
  Review,
  Prediction,
  Feedback,
} from "../../database/entities";
import { FarmType } from "../../database/types/farm.type";
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { WorkerRole } from "../../database/types/worker.type";
import { LivestockGender, TaskType } from "../../database/types";
import { LivestockType } from "../../database/entities/livestock.entity";
import { BreedingStatus } from "../../database/types/breeding-record.type";
import { GrowthPeriod } from "../../database/types/growth-record.type";
import { ExpenseCategory } from "../../database/types/expense-record.type";
import {
  LivestockAvailabilityStatus,
  LivestockUnavailabilityReason,
} from "../../database/types/livestock.type";
import { TaskStatus } from "../../database/types/task.type";
import { HealthRecordStatus } from "../../database/types/health-record.type";

describe("FarmService", () => {
  let module: TestingModule;
  let connection: Connection;
  let adminRepository: Repository<Admin>;
  let farmService: FarmService;

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
            url: configService.get("DATABASE_URL"),
            entities: [
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
            ],
            synchronize: true,
          }),
          inject: [ConfigService],
        }),
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
        ]),
      ],
      controllers: [],
      providers: [FarmService],
    }).compile();

    connection = module.get<Connection>(Connection);
    adminRepository = module.get<Repository<Admin>>(getRepositoryToken(Admin));
    farmService = module.get<FarmService>(FarmService);
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

  // Mutations
  describe("createFarm", () => {
    it("returns farm object when admin creates farm", async () => {
      await registerAdmin(adminInfo);

      const response = await farmService.createFarm({
        ...farmInfo,
        email: adminInfo.email,
      });

      expect(response.name).toBe(farmInfo.name);
      expect(response.farm_type).toBe(farmInfo.farmType);
      expect(response.location).toBe(farmInfo.location);
      expect(response.area).toBe(farmInfo.area);
      expect(response.barns).toBeUndefined();
      expect(response.pens).toBeUndefined();
      expect(response.livestock).toBeUndefined();
    });

    it("throws an error if admin not found", async () => {
      await expect(
        farmService.createFarm({
          ...farmInfo,
          email: adminInfo.email,
        }),
      ).rejects.toThrow(NotFoundException);

      await expect(
        farmService.createFarm({
          ...farmInfo,
          email: adminInfo.email,
        }),
      ).rejects.toThrow("Admin does not exist");
    });
  });

  describe("updateFarm", () => {
    it("returns farm object when admin updates farm", async () => {
      await setupForQueries();

      const admin = await getAdmin(adminInfo.email);

      let response = await farmService.updateFarm({
        ...farmInfo,
        farmTag: admin.farms[0].farm_tag,
        email: adminInfo.email,
        role: "ADMIN",
      });

      expect(response.name).toBe(farmInfo.name);
      expect(response.farm_type).toBe(farmInfo.farmType);
      expect(response.location).toBe(farmInfo.location);
      expect(response.area).toBe(farmInfo.area);
      expect(response.barns).toBeUndefined();
      expect(response.pens).toBeUndefined();
      expect(response.livestock).toBeUndefined();

      response = await farmService.updateFarm({
        ...farmInfo,
        farmTag: admin.farms[0].farm_tag,
        email: adminInfo.workers[1].email,
        role: "WORKER",
      });

      expect(response.name).toBe(farmInfo.name);
      expect(response.farm_type).toBe(farmInfo.farmType);
      expect(response.location).toBe(farmInfo.location);
      expect(response.area).toBe(farmInfo.area);
      expect(response.barns).toBeUndefined();
      expect(response.pens).toBeUndefined();
      expect(response.livestock).toBeUndefined();
    });

    it("throws an error if admin not found", async () => {
      await expect(
        farmService.updateFarm({
          ...farmInfo,
          farmTag: "52c13e61-be8e-4b8b-8da8-dd0940f87906",
          email: adminInfo.email,
          role: "ADMIN",
        }),
      ).rejects.toThrow(NotFoundException);

      await expect(
        farmService.updateFarm({
          ...farmInfo,
          farmTag: "52c13e61-be8e-4b8b-8da8-dd0940f87906",
          email: adminInfo.email,
          role: "ADMIN",
        }),
      ).rejects.toThrow("Farm not found");
    });
  });

  describe("addWorkersToFarm", () => {
    it("returns farm with workers when workers added successfully", async () => {
      await registerAdmin(adminInfo);

      const farm = await farmService.createFarm({
        ...farmInfo,
        email: adminInfo.email,
      });

      const response = await farmService.addWorkersToFarm({
        email: adminInfo.email,
        farmTag: farm.farm_tag,
        workers: adminInfo.workers,
        role: "ADMIN",
      });

      expect(response.workers.length).toEqual(2);
      expect(response.admin.workers.length).toEqual(2);
    });

    it("throws an error if farm does not belong to admin", async () => {
      await expect(
        farmService.addWorkersToFarm({
          email: adminInfo.email,
          farmTag: "52c13e61-be8e-4b8b-8da8-dd0940f87906",
          workers: adminInfo.workers,
          role: "ADMIN",
        }),
      ).rejects.toThrow(NotFoundException);

      await expect(
        farmService.addWorkersToFarm({
          email: adminInfo.email,
          farmTag: "52c13e61-be8e-4b8b-8da8-dd0940f87906",
          workers: adminInfo.workers,
          role: "ADMIN",
        }),
      ).rejects.toThrow("Farm not found");

      await expect(
        farmService.addWorkersToFarm({
          email: "fkaaziebu1998@gmail.com",
          farmTag: "52c13e61-be8e-4b8b-8da8-dd0940f87906",
          workers: adminInfo.workers,
          role: "ADMIN",
        }),
      ).rejects.toThrow("Farm not found");
    });

    it("throw an error if one of the workers email has already been used", async () => {
      await registerAdmin(adminInfo);

      const farm = await farmService.createFarm({
        ...farmInfo,
        email: adminInfo.email,
      });

      await farmService.addWorkersToFarm({
        email: adminInfo.email,
        farmTag: farm.farm_tag,
        workers: [adminInfo.workers[0]],
        role: "ADMIN",
      });

      await expect(
        farmService.addWorkersToFarm({
          email: adminInfo.email,
          farmTag: farm.farm_tag,
          workers: adminInfo.workers,
          role: "ADMIN",
        }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        farmService.addWorkersToFarm({
          email: adminInfo.email,
          farmTag: farm.farm_tag,
          workers: adminInfo.workers,
          role: "ADMIN",
        }),
      ).rejects.toThrow(
        `This email has already been taken, ${adminInfo.workers[0].email}`,
      );
    });
  });

  describe("assignWorkersToFarm", () => {
    it("returns farm with workers attached when successful", async () => {
      await registerAdmin(adminInfo);

      const farm = await farmService.createFarm({
        ...farmInfo,
        email: adminInfo.email,
      });

      const farm1 = await farmService.addWorkersToFarm({
        email: adminInfo.email,
        farmTag: farm.farm_tag,
        workers: adminInfo.workers,
        role: "ADMIN",
      });

      const farm2 = await farmService.createFarm({
        ...farmInfo,
        name: "Fred Farms 2",
        email: adminInfo.email,
      });

      const response = await farmService.assignWorkersToFarm({
        email: adminInfo.email,
        farmTag: farm2.farm_tag,
        workerTags: farm1.workers.map((worker) => worker.worker_tag),
        role: "ADMIN",
      });

      expect(response.workers.length).toEqual(2);
    });
  });

  describe("addWorkerReview", () => {
    it("returns added review for worker", async () => {
      await setupForQueries();
      let admin = await getAdmin(adminInfo.email);

      const response = await farmService.addWorkerReview({
        email: adminInfo.email,
        workerTag: admin.workers[0].worker_tag,
        review: {
          description: "All description",
          rating: 90,
        },
      });

      expect(response.description).toBe("All description");
      expect(response.rating).toEqual(90);

      admin = await getAdmin(adminInfo.email);
      expect(admin.workers[0].assigned_reviews.length).toEqual(1);
    });
  });

  describe("addBarnsToFarm", () => {
    it("returns farm with barns when barns added successfully", async () => {
      await setupForQueries();

      const admin = await getAdmin(adminInfo.email);

      let response = await farmService.addBarnsToFarm({
        email: adminInfo.email,
        farmTag: admin.farms[0].farm_tag,
        barns: [{ ...adminInfo.barns[0], unitId: "HN3" }],
        role: "ADMIN",
      });

      expect(response.barns.length).toEqual(3);

      response = await farmService.addBarnsToFarm({
        email: adminInfo.workers[1].email,
        farmTag: admin.farms[0].farm_tag,
        barns: [{ ...adminInfo.barns[0], unitId: "HN4" }],
        role: "WORKER",
      });

      expect(response.barns.length).toEqual(4);
    });
  });

  describe("updateBarn", () => {
    it("returns barn when update succeeded", async () => {
      await registerAdmin(adminInfo);

      const farm = await farmService.createFarm({
        ...farmInfo,
        email: adminInfo.email,
      });

      const farmWithBarns = await farmService.addBarnsToFarm({
        email: adminInfo.email,
        farmTag: farm.farm_tag,
        barns: adminInfo.barns,
        role: "ADMIN",
      });

      const response = await farmService.updateBarn({
        email: adminInfo.email,
        barnUnitId: farmWithBarns.barns[0].unit_id,
        barn: {
          ...adminInfo.barns.find(
            (bn) => bn.unitId === farmWithBarns.barns[0].unit_id,
          ),
          name: "Fred Barn updated",
        },
        role: "ADMIN",
      });

      expect(response.name).toBe("Fred Barn updated");
    });

    it("throws an error if barn to update does not exist", async () => {
      await expect(
        farmService.updateBarn({
          email: adminInfo.email,
          barnUnitId: "HN1",
          barn: {
            ...adminInfo.barns.find((bn) => bn.unitId === "HN1"),
            name: "Fred Barn updated",
          },
          role: "ADMIN",
        }),
      ).rejects.toThrow(NotFoundException);

      await expect(
        farmService.updateBarn({
          email: adminInfo.email,
          barnUnitId: "HN1",
          barn: {
            ...adminInfo.barns.find((bn) => bn.unitId === "HN1"),
            name: "Fred Barn updated",
          },
          role: "ADMIN",
        }),
      ).rejects.toThrow("Barn not found");
    });
  });

  describe("addPensToBarn", () => {
    it("returns barn with pen when pen added successfully", async () => {
      await setupForQueries();

      let response = await farmService.addPensToBarn({
        email: adminInfo.email,
        barnUnitId: adminInfo.barns.find((bn) => bn.unitId === "HN1").unitId,
        pens: [{ ...adminInfo.pens[0], unitId: "PEN3" }],
        role: "ADMIN",
      });

      expect(response.pens.length).toEqual(3);

      response = await farmService.addPensToBarn({
        email: adminInfo.workers[1].email,
        barnUnitId: adminInfo.barns.find((bn) => bn.unitId === "HN1").unitId,
        pens: [{ ...adminInfo.pens[0], unitId: "PEN4" }],
        role: "WORKER",
      });

      expect(response.pens.length).toEqual(4);
    });
  });

  describe("updatePen", () => {
    it("returns pen when pen added successfully", async () => {
      await setupForQueries();

      let response = await farmService.updatePen({
        email: adminInfo.email,
        penUnitId: adminInfo.pens.find((pn) => pn.unitId === "PEN1").unitId,
        pen: {
          ...adminInfo.pens.find((pn) => pn.unitId === "PEN1"),
          name: "Fred Pen 1 updated",
        },
        role: "ADMIN",
      });

      expect(response.name).toBe("Fred Pen 1 updated");

      response = await farmService.updatePen({
        email: adminInfo.workers[1].email,
        penUnitId: adminInfo.pens.find((pn) => pn.unitId === "PEN1").unitId,
        pen: {
          ...adminInfo.pens.find((pn) => pn.unitId === "PEN1"),
          name: "Fred Pen 2 updated",
        },
        role: "WORKER",
      });

      expect(response.name).toBe("Fred Pen 2 updated");
    });
  });

  describe("addLivestockToPen", () => {
    it("returns pen with livestock when added successfully", async () => {
      await setupForQueries();

      let response = await farmService.addLivestockToPen({
        email: adminInfo.email,
        penUnitId: adminInfo.pens.find((pn) => pn.unitId === "PEN1").unitId,
        livestock: [{ ...adminInfo.livestock[0], livestockTag: "LST3" }],
        role: "ADMIN",
      });

      expect(response.livestock.length).toEqual(3);

      response = await farmService.addLivestockToPen({
        email: adminInfo.workers[1].email,
        penUnitId: adminInfo.pens.find((pn) => pn.unitId === "PEN1").unitId,
        livestock: [{ ...adminInfo.livestock[0], livestockTag: "LST4" }],
        role: "WORKER",
      });

      expect(response.livestock.length).toEqual(4);
    });

    it("throws an error if livestock already exist", async () => {
      await registerAdmin(adminInfo);

      const farm = await farmService.createFarm({
        ...farmInfo,
        email: adminInfo.email,
      });

      const farmWithBarns = await farmService.addBarnsToFarm({
        email: adminInfo.email,
        farmTag: farm.farm_tag,
        barns: adminInfo.barns,
        role: "ADMIN",
      });

      await farmService.addPensToBarn({
        email: adminInfo.email,
        barnUnitId: farmWithBarns.barns.find((bn) => bn.unit_id === "HN1")
          .unit_id,
        pens: adminInfo.pens,
        role: "ADMIN",
      });

      await farmService.addLivestockToPen({
        email: adminInfo.email,
        penUnitId: adminInfo.pens.find((pn) => pn.unitId === "PEN1").unitId,
        livestock: adminInfo.livestock,
        role: "ADMIN",
      });

      await expect(
        farmService.addLivestockToPen({
          email: adminInfo.email,
          penUnitId: adminInfo.pens.find((pn) => pn.unitId === "PEN1").unitId,
          livestock: [adminInfo.livestock[0]],
          role: "ADMIN",
        }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        farmService.addLivestockToPen({
          email: adminInfo.email,
          penUnitId: adminInfo.pens.find((pn) => pn.unitId === "PEN1").unitId,
          livestock: [adminInfo.livestock[0]],
          role: "ADMIN",
        }),
      ).rejects.toThrow(
        `A livestock with livestock tag ${adminInfo.livestock[0].livestockTag} already exist`,
      );
    });

    it("throws an error when pen is not found", async () => {
      await expect(
        farmService.addLivestockToPen({
          email: adminInfo.email,
          penUnitId: adminInfo.pens.find((pn) => pn.unitId === "PEN1").unitId,
          livestock: adminInfo.livestock,
          role: "ADMIN",
        }),
      ).rejects.toThrow(NotFoundException);

      await expect(
        farmService.addLivestockToPen({
          email: adminInfo.email,
          penUnitId: adminInfo.pens.find((pn) => pn.unitId === "PEN1").unitId,
          livestock: adminInfo.livestock,
          role: "ADMIN",
        }),
      ).rejects.toThrow("Pen not found");
    });
  });

  describe("updateLivestock", () => {
    it("returns updated livestock when successful", async () => {
      await setupForQueries();

      await farmService.addLivestockToPen({
        email: adminInfo.email,
        penUnitId: adminInfo.pens.find((pn) => pn.unitId === "PEN1").unitId,
        livestock: [
          {
            livestockTag: "LST3",
            livestockType: LivestockType.GRASSCUTTER,
            birthDate: new Date(),
            breed: "WHITE",
            gender: LivestockGender.MALE,
            weight: 20,
          },
        ],
        role: "ADMIN",
      });

      let response = await farmService.updateLivestock({
        email: adminInfo.email,
        livestockTag: "LST3",
        livestock: {
          ...{
            livestockTag: "LST3",
            livestockType: LivestockType.GRASSCUTTER,
            birthDate: new Date(),
            breed: "WHITE",
            gender: LivestockGender.MALE,
            weight: 20,
          },
          motherTag: adminInfo.livestock[1].livestockTag,
          fatherTag: adminInfo.livestock[0].livestockTag,
        },
        role: "ADMIN",
      });

      expect(response.mother.livestock_tag).toBe(
        adminInfo.livestock[1].livestockTag,
      );

      expect(response.father.livestock_tag).toBe(
        adminInfo.livestock[0].livestockTag,
      );

      let motherLivestock = await farmService.getLivestock({
        email: adminInfo.email,
        livestockTag: response.mother.livestock_tag,
        role: "ADMIN",
      });

      expect(motherLivestock.maternalOffspring.length).toBe(1);
      expect(motherLivestock.maternalOffspring[0].livestock_tag).toBe("LST3");

      let fatherLivestock = await farmService.getLivestock({
        email: adminInfo.email,
        livestockTag: response.father.livestock_tag,
        role: "ADMIN",
      });

      expect(fatherLivestock.paternalOffspring.length).toBe(1);
      expect(fatherLivestock.paternalOffspring[0].livestock_tag).toBe("LST3");

      // worker stuffs
      response = await farmService.updateLivestock({
        email: adminInfo.workers[1].email,
        livestockTag: "LST3",
        livestock: {
          ...{
            livestockTag: "LST3",
            livestockType: LivestockType.GRASSCUTTER,
            birthDate: new Date(),
            breed: "WHITE",
            gender: LivestockGender.MALE,
            weight: 20,
          },
          motherTag: adminInfo.livestock[1].livestockTag,
          fatherTag: adminInfo.livestock[0].livestockTag,
        },
        role: "WORKER",
      });

      expect(response.mother.livestock_tag).toBe(
        adminInfo.livestock[1].livestockTag,
      );

      expect(response.father.livestock_tag).toBe(
        adminInfo.livestock[0].livestockTag,
      );

      motherLivestock = await farmService.getLivestock({
        email: adminInfo.workers[1].email,
        livestockTag: response.mother.livestock_tag,
        role: "WORKER",
      });

      expect(motherLivestock.maternalOffspring.length).toBe(1);
      expect(motherLivestock.maternalOffspring[0].livestock_tag).toBe("LST3");

      fatherLivestock = await farmService.getLivestock({
        email: adminInfo.workers[1].email,
        livestockTag: response.father.livestock_tag,
        role: "WORKER",
      });

      expect(fatherLivestock.paternalOffspring.length).toBe(1);
      expect(fatherLivestock.paternalOffspring[0].livestock_tag).toBe("LST3");
    });

    it("throws an error when livestock is not found", async () => {
      await expect(
        farmService.updateLivestock({
          email: adminInfo.email,
          livestockTag: adminInfo.livestock[0].livestockTag,
          livestock: {
            ...adminInfo.livestock[0],
            motherTag: adminInfo.livestock[1].livestockTag,
          },
          role: "ADMIN",
        }),
      ).rejects.toThrow(NotFoundException);

      await expect(
        farmService.updateLivestock({
          email: adminInfo.email,
          livestockTag: adminInfo.livestock[0].livestockTag,
          livestock: {
            ...adminInfo.livestock[0],
            motherTag: adminInfo.livestock[1].livestockTag,
          },
          role: "ADMIN",
        }),
      ).rejects.toThrow("Livestock not found");
    });
  });

  describe("addLivestockBreedingRecord", () => {
    it("returns createdbreeding record when successful", async () => {
      await registerAdmin(adminInfo);

      const farm = await farmService.createFarm({
        ...farmInfo,
        email: adminInfo.email,
      });

      const farmWithBarns = await farmService.addBarnsToFarm({
        email: adminInfo.email,
        farmTag: farm.farm_tag,
        barns: adminInfo.barns,
        role: "ADMIN",
      });

      await farmService.addPensToBarn({
        email: adminInfo.email,
        barnUnitId: farmWithBarns.barns.find((bn) => bn.unit_id === "HN1")
          .unit_id,
        pens: adminInfo.pens,
        role: "ADMIN",
      });

      await farmService.addLivestockToPen({
        email: adminInfo.email,
        penUnitId: adminInfo.pens.find((pn) => pn.unitId === "PEN1").unitId,
        livestock: adminInfo.livestock,
        role: "ADMIN",
      });

      const response = await farmService.addLivestockBreedingRecord({
        email: adminInfo.email,
        maleLivestockTag: adminInfo.livestock[0].livestockTag,
        femaleLivestockTag: adminInfo.livestock[1].livestockTag,
        breedingRecord: {
          matingDate: new Date(),
          expectedDelivery: new Date(),
          status: BreedingStatus.PLANNED,
        },
        role: "ADMIN",
      });

      expect(response).toBeDefined();
      expect(response.status).toBe(BreedingStatus.PLANNED);
    });

    it("throws an error when livestock is not found", async () => {
      await expect(
        farmService.addLivestockBreedingRecord({
          email: adminInfo.email,
          maleLivestockTag: adminInfo.livestock[0].livestockTag,
          femaleLivestockTag: adminInfo.livestock[1].livestockTag,
          breedingRecord: {
            matingDate: new Date(),
            expectedDelivery: new Date(),
            status: BreedingStatus.PLANNED,
          },
          role: "ADMIN",
        }),
      ).rejects.toThrow(NotFoundException);
      await expect(
        farmService.addLivestockBreedingRecord({
          email: adminInfo.email,
          maleLivestockTag: adminInfo.livestock[0].livestockTag,
          femaleLivestockTag: adminInfo.livestock[1].livestockTag,
          breedingRecord: {
            matingDate: new Date(),
            expectedDelivery: new Date(),
            status: BreedingStatus.PLANNED,
          },
          role: "ADMIN",
        }),
      ).rejects.toThrow("Male livestock not found");
    });

    it("throws an error if female livestock already have an active breeding record", async () => {
      await registerAdmin(adminInfo);

      const farm = await farmService.createFarm({
        ...farmInfo,
        email: adminInfo.email,
      });

      const farmWithBarns = await farmService.addBarnsToFarm({
        email: adminInfo.email,
        farmTag: farm.farm_tag,
        barns: adminInfo.barns,
        role: "ADMIN",
      });

      await farmService.addPensToBarn({
        email: adminInfo.email,
        barnUnitId: farmWithBarns.barns.find((bn) => bn.unit_id === "HN1")
          .unit_id,
        pens: adminInfo.pens,
        role: "ADMIN",
      });

      await farmService.addLivestockToPen({
        email: adminInfo.email,
        penUnitId: adminInfo.pens.find((pn) => pn.unitId === "PEN1").unitId,
        livestock: adminInfo.livestock,
        role: "ADMIN",
      });

      await farmService.addLivestockBreedingRecord({
        email: adminInfo.email,
        maleLivestockTag: adminInfo.livestock[0].livestockTag,
        femaleLivestockTag: adminInfo.livestock[1].livestockTag,
        breedingRecord: {
          matingDate: new Date(),
          expectedDelivery: new Date(),
          status: BreedingStatus.PLANNED,
        },
        role: "ADMIN",
      });

      await expect(
        farmService.addLivestockBreedingRecord({
          email: adminInfo.email,
          maleLivestockTag: adminInfo.livestock[0].livestockTag,
          femaleLivestockTag: adminInfo.livestock[1].livestockTag,
          breedingRecord: {
            matingDate: new Date(),
            expectedDelivery: new Date(),
            status: BreedingStatus.PLANNED,
          },
          role: "ADMIN",
        }),
      ).rejects.toThrow(ConflictException);

      await expect(
        farmService.addLivestockBreedingRecord({
          email: adminInfo.email,
          maleLivestockTag: adminInfo.livestock[0].livestockTag,
          femaleLivestockTag: adminInfo.livestock[1].livestockTag,
          breedingRecord: {
            matingDate: new Date(),
            expectedDelivery: new Date(),
            status: BreedingStatus.PLANNED,
          },
          role: "ADMIN",
        }),
      ).rejects.toThrow(
        "Female livestock already has an active breeding record",
      );
    });

    it("throws an error if livestock do not belong to the same pen", async () => {
      await registerAdmin(adminInfo);

      const farm = await farmService.createFarm({
        ...farmInfo,
        email: adminInfo.email,
      });

      const farmWithBarns = await farmService.addBarnsToFarm({
        email: adminInfo.email,
        farmTag: farm.farm_tag,
        barns: adminInfo.barns,
        role: "ADMIN",
      });

      await farmService.addPensToBarn({
        email: adminInfo.email,
        barnUnitId: farmWithBarns.barns.find((bn) => bn.unit_id === "HN1")
          .unit_id,
        pens: adminInfo.pens,
        role: "ADMIN",
      });

      await farmService.addLivestockToPen({
        email: adminInfo.email,
        penUnitId: adminInfo.pens.find((pn) => pn.unitId === "PEN1").unitId,
        livestock: [adminInfo.livestock[0]],
        role: "ADMIN",
      });

      await farmService.addLivestockToPen({
        email: adminInfo.email,
        penUnitId: adminInfo.pens.find((pn) => pn.unitId === "PEN2").unitId,
        livestock: [adminInfo.livestock[1]],
        role: "ADMIN",
      });

      await expect(
        farmService.addLivestockBreedingRecord({
          email: adminInfo.email,
          maleLivestockTag: adminInfo.livestock[0].livestockTag,
          femaleLivestockTag: adminInfo.livestock[1].livestockTag,
          breedingRecord: {
            matingDate: new Date(),
            expectedDelivery: new Date(),
            status: BreedingStatus.PLANNED,
          },
          role: "ADMIN",
        }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        farmService.addLivestockBreedingRecord({
          email: adminInfo.email,
          maleLivestockTag: adminInfo.livestock[0].livestockTag,
          femaleLivestockTag: adminInfo.livestock[1].livestockTag,
          breedingRecord: {
            matingDate: new Date(),
            expectedDelivery: new Date(),
            status: BreedingStatus.PLANNED,
          },
          role: "ADMIN",
        }),
      ).rejects.toThrow(
        "Livestock must be in the same pen to create a breeding record",
      );
    });
  });

  describe("updateLivestockBreedingRecord", () => {
    it("returns updated breeding record", async () => {
      await registerAdmin(adminInfo);

      const farm = await farmService.createFarm({
        ...farmInfo,
        email: adminInfo.email,
      });

      const farmWithBarns = await farmService.addBarnsToFarm({
        email: adminInfo.email,
        farmTag: farm.farm_tag,
        barns: adminInfo.barns,
        role: "ADMIN",
      });

      await farmService.addPensToBarn({
        email: adminInfo.email,
        barnUnitId: farmWithBarns.barns.find((bn) => bn.unit_id === "HN1")
          .unit_id,
        pens: adminInfo.pens,
        role: "ADMIN",
      });

      await farmService.addLivestockToPen({
        email: adminInfo.email,
        penUnitId: adminInfo.pens.find((pn) => pn.unitId === "PEN1").unitId,
        livestock: adminInfo.livestock,
        role: "ADMIN",
      });

      const record = await farmService.addLivestockBreedingRecord({
        email: adminInfo.email,
        maleLivestockTag: adminInfo.livestock[0].livestockTag,
        femaleLivestockTag: adminInfo.livestock[1].livestockTag,
        breedingRecord: {
          matingDate: new Date(),
          expectedDelivery: new Date(),
          status: BreedingStatus.PLANNED,
        },
        role: "ADMIN",
      });

      let response = await farmService.updateLivestockBreedingRecord({
        email: adminInfo.email,
        breedingRecordId: record.id,
        breedingRecord: {
          matingDate: new Date(),
          expectedDelivery: new Date(),
          status: BreedingStatus.IN_PROGRESS,
        },
        role: "ADMIN",
      });

      expect(response).toBeDefined();
      expect(response.offspring_count_male).toEqual(null);
      expect(response.offspring_count_female).toEqual(null);
      expect(response.status).toEqual(BreedingStatus.IN_PROGRESS);

      response = await farmService.updateLivestockBreedingRecord({
        email: adminInfo.email,
        breedingRecordId: record.id,
        breedingRecord: {
          matingDate: new Date(),
          actualDelivery: new Date(),
          status: BreedingStatus.SUCCESSFUL,
          offsprings: [
            {
              livestockTag: "OF1",
              breed: "WHITE",
              weight: 20,
              gender: LivestockGender.MALE,
            },
            {
              livestockTag: "OF2",
              breed: "WHITE",
              weight: 20,
              gender: LivestockGender.MALE,
            },
            {
              livestockTag: "OF3",
              breed: "BLACK",
              weight: 17,
              gender: LivestockGender.FEMALE,
            },
          ],
        },
        role: "ADMIN",
      });

      expect(response).toBeDefined();
      expect(response.offspring_count_male).toEqual(2);
      expect(response.offspring_count_female).toEqual(1);
      expect(response.status).toEqual(BreedingStatus.SUCCESSFUL);
    });

    it("throws an error if breeding record does not exist", async () => {
      await expect(
        farmService.updateLivestockBreedingRecord({
          email: adminInfo.email,
          breedingRecordId: 234,
          breedingRecord: {
            matingDate: new Date(),
            expectedDelivery: new Date(),
            status: BreedingStatus.IN_PROGRESS,
          },
          role: "ADMIN",
        }),
      ).rejects.toThrow(NotFoundException);

      await expect(
        farmService.updateLivestockBreedingRecord({
          email: adminInfo.email,
          breedingRecordId: 234,
          breedingRecord: {
            matingDate: new Date(),
            expectedDelivery: new Date(),
            status: BreedingStatus.IN_PROGRESS,
          },
          role: "ADMIN",
        }),
      ).rejects.toThrow("Breeding record not found");
    });

    it("throws an error for offspring update without actual delivery date", async () => {
      await registerAdmin(adminInfo);

      const farm = await farmService.createFarm({
        ...farmInfo,
        email: adminInfo.email,
      });

      const farmWithBarns = await farmService.addBarnsToFarm({
        email: adminInfo.email,
        farmTag: farm.farm_tag,
        barns: adminInfo.barns,
        role: "ADMIN",
      });

      await farmService.addPensToBarn({
        email: adminInfo.email,
        barnUnitId: farmWithBarns.barns.find((bn) => bn.unit_id === "HN1")
          .unit_id,
        pens: adminInfo.pens,
        role: "ADMIN",
      });

      await farmService.addLivestockToPen({
        email: adminInfo.email,
        penUnitId: adminInfo.pens.find((pn) => pn.unitId === "PEN1").unitId,
        livestock: adminInfo.livestock,
        role: "ADMIN",
      });

      const record = await farmService.addLivestockBreedingRecord({
        email: adminInfo.email,
        maleLivestockTag: adminInfo.livestock[0].livestockTag,
        femaleLivestockTag: adminInfo.livestock[1].livestockTag,
        breedingRecord: {
          matingDate: new Date(),
          expectedDelivery: new Date(),
          status: BreedingStatus.PLANNED,
        },
        role: "ADMIN",
      });

      await expect(
        farmService.updateLivestockBreedingRecord({
          email: adminInfo.email,
          breedingRecordId: record.id,
          breedingRecord: {
            matingDate: new Date(),
            status: BreedingStatus.SUCCESSFUL,
            offsprings: [
              {
                livestockTag: "OF1",
                breed: "WHITE",
                weight: 20,
                gender: LivestockGender.MALE,
              },
              {
                livestockTag: "OF2",
                breed: "WHITE",
                weight: 20,
                gender: LivestockGender.MALE,
              },
              {
                livestockTag: "OF3",
                breed: "BLACK",
                weight: 17,
                gender: LivestockGender.FEMALE,
              },
            ],
          },
          role: "ADMIN",
        }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        farmService.updateLivestockBreedingRecord({
          email: adminInfo.email,
          breedingRecordId: record.id,
          breedingRecord: {
            matingDate: new Date(),
            status: BreedingStatus.SUCCESSFUL,
            offsprings: [
              {
                livestockTag: "OF1",
                breed: "WHITE",
                weight: 20,
                gender: LivestockGender.MALE,
              },
              {
                livestockTag: "OF2",
                breed: "WHITE",
                weight: 20,
                gender: LivestockGender.MALE,
              },
              {
                livestockTag: "OF3",
                breed: "BLACK",
                weight: 17,
                gender: LivestockGender.FEMALE,
              },
            ],
          },
          role: "ADMIN",
        }),
      ).rejects.toThrow(
        "Actual delivery date must be provided when there are offsprings",
      );
    });

    it("throws an error for offspring update without proper status value", async () => {
      await registerAdmin(adminInfo);

      const farm = await farmService.createFarm({
        ...farmInfo,
        email: adminInfo.email,
      });

      const farmWithBarns = await farmService.addBarnsToFarm({
        email: adminInfo.email,
        farmTag: farm.farm_tag,
        barns: adminInfo.barns,
        role: "ADMIN",
      });

      await farmService.addPensToBarn({
        email: adminInfo.email,
        barnUnitId: farmWithBarns.barns.find((bn) => bn.unit_id === "HN1")
          .unit_id,
        pens: adminInfo.pens,
        role: "ADMIN",
      });

      await farmService.addLivestockToPen({
        email: adminInfo.email,
        penUnitId: adminInfo.pens.find((pn) => pn.unitId === "PEN1").unitId,
        livestock: adminInfo.livestock,
        role: "ADMIN",
      });

      const record = await farmService.addLivestockBreedingRecord({
        email: adminInfo.email,
        maleLivestockTag: adminInfo.livestock[0].livestockTag,
        femaleLivestockTag: adminInfo.livestock[1].livestockTag,
        breedingRecord: {
          matingDate: new Date(),
          expectedDelivery: new Date(),
          status: BreedingStatus.PLANNED,
        },
        role: "ADMIN",
      });

      await expect(
        farmService.updateLivestockBreedingRecord({
          email: adminInfo.email,
          breedingRecordId: record.id,
          breedingRecord: {
            matingDate: new Date(),
            actualDelivery: new Date(),
            status: BreedingStatus.IN_PROGRESS,
            offsprings: [
              {
                livestockTag: "OF1",
                breed: "WHITE",
                weight: 20,
                gender: LivestockGender.MALE,
              },
              {
                livestockTag: "OF2",
                breed: "WHITE",
                weight: 20,
                gender: LivestockGender.MALE,
              },
              {
                livestockTag: "OF3",
                breed: "BLACK",
                weight: 17,
                gender: LivestockGender.FEMALE,
              },
            ],
          },
          role: "ADMIN",
        }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        farmService.updateLivestockBreedingRecord({
          email: adminInfo.email,
          breedingRecordId: record.id,
          breedingRecord: {
            matingDate: new Date(),
            actualDelivery: new Date(),
            status: BreedingStatus.IN_PROGRESS,
            offsprings: [
              {
                livestockTag: "OF1",
                breed: "WHITE",
                weight: 20,
                gender: LivestockGender.MALE,
              },
              {
                livestockTag: "OF2",
                breed: "WHITE",
                weight: 20,
                gender: LivestockGender.MALE,
              },
              {
                livestockTag: "OF3",
                breed: "BLACK",
                weight: 17,
                gender: LivestockGender.FEMALE,
              },
            ],
          },
          role: "ADMIN",
        }),
      ).rejects.toThrow(
        "Breeding status must be 'SUCCESSFUL' when there are offsprings",
      );
    });

    it("throws an error for offspring is empty but status is 'SUCCESSFUL'", async () => {
      await registerAdmin(adminInfo);

      const farm = await farmService.createFarm({
        ...farmInfo,
        email: adminInfo.email,
      });

      const farmWithBarns = await farmService.addBarnsToFarm({
        email: adminInfo.email,
        farmTag: farm.farm_tag,
        barns: adminInfo.barns,
        role: "ADMIN",
      });

      await farmService.addPensToBarn({
        email: adminInfo.email,
        barnUnitId: farmWithBarns.barns.find((bn) => bn.unit_id === "HN1")
          .unit_id,
        pens: adminInfo.pens,
        role: "ADMIN",
      });

      await farmService.addLivestockToPen({
        email: adminInfo.email,
        penUnitId: adminInfo.pens.find((pn) => pn.unitId === "PEN1").unitId,
        livestock: adminInfo.livestock,
        role: "ADMIN",
      });

      const record = await farmService.addLivestockBreedingRecord({
        email: adminInfo.email,
        maleLivestockTag: adminInfo.livestock[0].livestockTag,
        femaleLivestockTag: adminInfo.livestock[1].livestockTag,
        breedingRecord: {
          matingDate: new Date(),
          expectedDelivery: new Date(),
          status: BreedingStatus.PLANNED,
        },
        role: "ADMIN",
      });

      await expect(
        farmService.updateLivestockBreedingRecord({
          email: adminInfo.email,
          breedingRecordId: record.id,
          breedingRecord: {
            matingDate: new Date(),
            status: BreedingStatus.SUCCESSFUL,
          },
          role: "ADMIN",
        }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        farmService.updateLivestockBreedingRecord({
          email: adminInfo.email,
          breedingRecordId: record.id,
          breedingRecord: {
            matingDate: new Date(),
            status: BreedingStatus.SUCCESSFUL,
          },
          role: "ADMIN",
        }),
      ).rejects.toThrow(
        "There must be atleast one offspring for a successful breeding record",
      );
    });
  });

  describe("addLivestockHealthRecord", () => {
    it("returns the created health record when successful", async () => {
      await registerAdmin(adminInfo);

      const farm = await farmService.createFarm({
        ...farmInfo,
        email: adminInfo.email,
      });

      const farmWithBarns = await farmService.addBarnsToFarm({
        email: adminInfo.email,
        farmTag: farm.farm_tag,
        barns: adminInfo.barns,
        role: "ADMIN",
      });

      await farmService.addPensToBarn({
        email: adminInfo.email,
        barnUnitId: farmWithBarns.barns.find((bn) => bn.unit_id === "HN1")
          .unit_id,
        pens: adminInfo.pens,
        role: "ADMIN",
      });

      await farmService.addLivestockToPen({
        email: adminInfo.email,
        penUnitId: adminInfo.pens.find((pn) => pn.unitId === "PEN1").unitId,
        livestock: adminInfo.livestock,
        role: "ADMIN",
      });

      const response = await farmService.addLivestockHealthRecord({
        email: adminInfo.email,
        livestockTag: adminInfo.livestock[0].livestockTag,
        healthRecord: {
          cost: 20,
          diagnosis: "Healthy",
          issue: "None",
          notes: "None",
          symptoms: "None",
          treatment: "None",
          recordDate: new Date(),
          recordStatus: HealthRecordStatus.HEALTHY,
        },
        role: "ADMIN",
      });

      expect(response).toBeDefined();
      expect(response.diagnosis).toBe("Healthy");
      expect(response.cost).toEqual(20);
    });

    it("throws an error if livestock does not exist", async () => {
      await expect(
        farmService.addLivestockHealthRecord({
          email: adminInfo.email,
          livestockTag: adminInfo.livestock[0].livestockTag,
          healthRecord: {
            cost: 20,
            diagnosis: "Healthy",
            issue: "None",
            notes: "None",
            symptoms: "None",
            treatment: "None",
            recordDate: new Date(),
            recordStatus: HealthRecordStatus.HEALTHY,
          },
          role: "ADMIN",
        }),
      ).rejects.toThrow(NotFoundException);

      await expect(
        farmService.addLivestockHealthRecord({
          email: adminInfo.email,
          livestockTag: adminInfo.livestock[0].livestockTag,
          healthRecord: {
            cost: 20,
            diagnosis: "Healthy",
            issue: "None",
            notes: "None",
            symptoms: "None",
            treatment: "None",
            recordDate: new Date(),
            recordStatus: HealthRecordStatus.HEALTHY,
          },
          role: "ADMIN",
        }),
      ).rejects.toThrow("Livestock not found");
    });
  });

  describe("updateLivestockHealthRecord", () => {
    it("returns the updated health record when successful", async () => {
      await registerAdmin(adminInfo);

      const farm = await farmService.createFarm({
        ...farmInfo,
        email: adminInfo.email,
      });

      const farmWithBarns = await farmService.addBarnsToFarm({
        email: adminInfo.email,
        farmTag: farm.farm_tag,
        barns: adminInfo.barns,
        role: "ADMIN",
      });

      await farmService.addPensToBarn({
        email: adminInfo.email,
        barnUnitId: farmWithBarns.barns.find((bn) => bn.unit_id === "HN1")
          .unit_id,
        pens: adminInfo.pens,
        role: "ADMIN",
      });

      await farmService.addLivestockToPen({
        email: adminInfo.email,
        penUnitId: adminInfo.pens.find((pn) => pn.unitId === "PEN1").unitId,
        livestock: adminInfo.livestock,
        role: "ADMIN",
      });

      const record = await farmService.addLivestockHealthRecord({
        email: adminInfo.email,
        livestockTag: adminInfo.livestock[0].livestockTag,
        healthRecord: {
          cost: 20,
          diagnosis: "Healthy",
          issue: "None",
          notes: "None",
          symptoms: "None",
          treatment: "None",
          recordDate: new Date(),
          recordStatus: HealthRecordStatus.HEALTHY,
        },
        role: "ADMIN",
      });

      const response = await farmService.updateLivestockHealthRecord({
        email: adminInfo.email,
        healthRecordId: record.id,
        healthRecord: {
          cost: 25,
          diagnosis: "Healthy",
          issue: "None",
          notes: "None",
          symptoms: "None",
          treatment: "None",
          recordDate: new Date(),
        },
        role: "ADMIN",
      });

      expect(response).toBeDefined();
      expect(response.diagnosis).toBe("Healthy");
      expect(response.cost).toEqual(25);
    });

    it("throws an error if livestock does not exist", async () => {
      await expect(
        farmService.addLivestockHealthRecord({
          email: adminInfo.email,
          livestockTag: adminInfo.livestock[0].livestockTag,
          healthRecord: {
            cost: 20,
            diagnosis: "Healthy",
            issue: "None",
            notes: "None",
            symptoms: "None",
            treatment: "None",
            recordDate: new Date(),
            recordStatus: HealthRecordStatus.HEALTHY,
          },
          role: "ADMIN",
        }),
      ).rejects.toThrow(NotFoundException);

      await expect(
        farmService.addLivestockHealthRecord({
          email: adminInfo.email,
          livestockTag: adminInfo.livestock[0].livestockTag,
          healthRecord: {
            cost: 20,
            diagnosis: "Healthy",
            issue: "None",
            notes: "None",
            symptoms: "None",
            treatment: "None",
            recordDate: new Date(),
            recordStatus: HealthRecordStatus.HEALTHY,
          },
          role: "ADMIN",
        }),
      ).rejects.toThrow("Livestock not found");
    });
  });

  describe("addLivestockGrowthRecord", () => {
    it("returns the created growth record when successful", async () => {
      await registerAdmin(adminInfo);

      const farm = await farmService.createFarm({
        ...farmInfo,
        email: adminInfo.email,
      });

      const farmWithBarns = await farmService.addBarnsToFarm({
        email: adminInfo.email,
        farmTag: farm.farm_tag,
        barns: adminInfo.barns,
        role: "ADMIN",
      });

      await farmService.addPensToBarn({
        email: adminInfo.email,
        barnUnitId: farmWithBarns.barns.find((bn) => bn.unit_id === "HN1")
          .unit_id,
        pens: adminInfo.pens,
        role: "ADMIN",
      });

      await farmService.addLivestockToPen({
        email: adminInfo.email,
        penUnitId: adminInfo.pens.find((pn) => pn.unitId === "PEN1").unitId,
        livestock: adminInfo.livestock,
        role: "ADMIN",
      });

      const response = await farmService.addLivestockGrowthRecord({
        email: adminInfo.email,
        livestockTag: adminInfo.livestock[0].livestockTag,
        growthRecord: {
          notes: "Initial growth record",
          recordDate: new Date(),
          weight: 100,
          period: GrowthPeriod.BIRTH,
        },
        role: "ADMIN",
      });

      expect(response).toBeDefined();
      expect(response.weight).toBe(100);
      expect(response.period).toEqual(GrowthPeriod.BIRTH);
    });

    it("throws an error if livestock does not exist", async () => {
      await expect(
        farmService.addLivestockGrowthRecord({
          email: adminInfo.email,
          livestockTag: adminInfo.livestock[0].livestockTag,
          growthRecord: {
            notes: "Initial growth record",
            recordDate: new Date(),
            weight: 100,
            period: GrowthPeriod.BIRTH,
          },
          role: "ADMIN",
        }),
      ).rejects.toThrow(NotFoundException);

      await expect(
        farmService.addLivestockGrowthRecord({
          email: adminInfo.email,
          livestockTag: adminInfo.livestock[0].livestockTag,
          growthRecord: {
            notes: "Initial growth record",
            recordDate: new Date(),
            weight: 100,
            period: GrowthPeriod.BIRTH,
          },
          role: "ADMIN",
        }),
      ).rejects.toThrow("Livestock not found");
    });
  });

  describe("updateLivestockGrowthRecord", () => {
    it("returns the updated growth record when successful", async () => {
      await registerAdmin(adminInfo);

      const farm = await farmService.createFarm({
        ...farmInfo,
        email: adminInfo.email,
      });

      const farmWithBarns = await farmService.addBarnsToFarm({
        email: adminInfo.email,
        farmTag: farm.farm_tag,
        barns: adminInfo.barns,
        role: "ADMIN",
      });

      await farmService.addPensToBarn({
        email: adminInfo.email,
        barnUnitId: farmWithBarns.barns.find((bn) => bn.unit_id === "HN1")
          .unit_id,
        pens: adminInfo.pens,
        role: "ADMIN",
      });

      await farmService.addLivestockToPen({
        email: adminInfo.email,
        penUnitId: adminInfo.pens.find((pn) => pn.unitId === "PEN1").unitId,
        livestock: adminInfo.livestock,
        role: "ADMIN",
      });

      const record = await farmService.addLivestockGrowthRecord({
        email: adminInfo.email,
        livestockTag: adminInfo.livestock[0].livestockTag,
        growthRecord: {
          notes: "Initial growth record",
          recordDate: new Date(),
          weight: 100,
          period: GrowthPeriod.BIRTH,
        },
        role: "ADMIN",
      });

      const response = await farmService.updateLivestockGrowthRecord({
        email: adminInfo.email,
        growthRecordId: record.id,
        growthRecord: {
          notes: "Initial update record",
          recordDate: new Date(),
          weight: 200,
          period: GrowthPeriod.FOUR_WEEKS,
        },
        role: "ADMIN",
      });

      expect(response).toBeDefined();
      expect(response.weight).toBe(200);
      expect(response.notes).not.toBe(record.notes);
      expect(response.period).toBe(GrowthPeriod.FOUR_WEEKS);
    });

    it("throws an error if livestock does not exist", async () => {
      await expect(
        farmService.updateLivestockGrowthRecord({
          email: adminInfo.email,
          growthRecordId: 234,
          growthRecord: {
            notes: "Initial update record",
            recordDate: new Date(),
            weight: 200,
            period: GrowthPeriod.FOUR_WEEKS,
          },
          role: "ADMIN",
        }),
      ).rejects.toThrow(NotFoundException);

      await expect(
        farmService.updateLivestockGrowthRecord({
          email: adminInfo.email,
          growthRecordId: 234,
          growthRecord: {
            notes: "Initial update record",
            recordDate: new Date(),
            weight: 200,
            period: GrowthPeriod.FOUR_WEEKS,
          },
          role: "ADMIN",
        }),
      ).rejects.toThrow("Growth record not found");
    });
  });

  describe("addLivestockExpenseRecord", () => {
    it("returns the created expense record when successful", async () => {
      await registerAdmin(adminInfo);

      const farm = await farmService.createFarm({
        ...farmInfo,
        email: adminInfo.email,
      });

      const farmWithBarns = await farmService.addBarnsToFarm({
        email: adminInfo.email,
        farmTag: farm.farm_tag,
        barns: adminInfo.barns,
        role: "ADMIN",
      });

      await farmService.addPensToBarn({
        email: adminInfo.email,
        barnUnitId: farmWithBarns.barns.find((bn) => bn.unit_id === "HN1")
          .unit_id,
        pens: adminInfo.pens,
        role: "ADMIN",
      });

      await farmService.addLivestockToPen({
        email: adminInfo.email,
        penUnitId: adminInfo.pens.find((pn) => pn.unitId === "PEN1").unitId,
        livestock: adminInfo.livestock,
        role: "ADMIN",
      });

      const response = await farmService.addLivestockExpenseRecord({
        email: adminInfo.email,
        livestockTag: adminInfo.livestock[0].livestockTag,
        expenseRecord: {
          amount: 100,
          expenseDate: new Date(),
          category: ExpenseCategory.FEED,
          notes: "Initial expense record",
        },
        role: "ADMIN",
      });

      expect(response).toBeDefined();
      expect(response.amount).toBe(100);
      expect(response.category).toEqual(ExpenseCategory.FEED);
    });

    it("throws an error if livestock does not exist", async () => {
      await expect(
        farmService.addLivestockExpenseRecord({
          email: adminInfo.email,
          livestockTag: adminInfo.livestock[0].livestockTag,
          expenseRecord: {
            amount: 100,
            expenseDate: new Date(),
            category: ExpenseCategory.FEED,
            notes: "Initial expense record",
          },
          role: "ADMIN",
        }),
      ).rejects.toThrow(NotFoundException);

      await expect(
        farmService.addLivestockExpenseRecord({
          email: adminInfo.email,
          livestockTag: adminInfo.livestock[0].livestockTag,
          expenseRecord: {
            amount: 100,
            expenseDate: new Date(),
            category: ExpenseCategory.FEED,
            notes: "Initial expense record",
          },
          role: "ADMIN",
        }),
      ).rejects.toThrow("Livestock not found");
    });
  });

  describe("updateLivestockExpenseRecord", () => {
    it("returns the updated expense record when successful", async () => {
      await registerAdmin(adminInfo);

      const farm = await farmService.createFarm({
        ...farmInfo,
        email: adminInfo.email,
      });

      const farmWithBarns = await farmService.addBarnsToFarm({
        email: adminInfo.email,
        farmTag: farm.farm_tag,
        barns: adminInfo.barns,
        role: "ADMIN",
      });

      await farmService.addPensToBarn({
        email: adminInfo.email,
        barnUnitId: farmWithBarns.barns.find((bn) => bn.unit_id === "HN1")
          .unit_id,
        pens: adminInfo.pens,
        role: "ADMIN",
      });

      await farmService.addLivestockToPen({
        email: adminInfo.email,
        penUnitId: adminInfo.pens.find((pn) => pn.unitId === "PEN1").unitId,
        livestock: adminInfo.livestock,
        role: "ADMIN",
      });

      const record = await farmService.addLivestockExpenseRecord({
        email: adminInfo.email,
        livestockTag: adminInfo.livestock[0].livestockTag,
        expenseRecord: {
          amount: 100,
          expenseDate: new Date(),
          category: ExpenseCategory.FEED,
          notes: "Initial expense record",
        },
        role: "ADMIN",
      });

      const response = await farmService.updateLivestockExpenseRecord({
        email: adminInfo.email,
        expenseRecordId: record.id,
        expenseRecord: {
          amount: 200,
          expenseDate: new Date(),
          category: ExpenseCategory.CLEANING,
          notes: "Initial update record",
        },
        role: "ADMIN",
      });

      expect(response).toBeDefined();
      expect(response.amount).toBe(200);
      expect(response.notes).not.toBe(record.notes);
      expect(response.category).toBe(ExpenseCategory.CLEANING);
    });

    it("throws an error if livestock does not exist", async () => {
      await expect(
        farmService.updateLivestockExpenseRecord({
          email: adminInfo.email,
          expenseRecordId: 234,
          expenseRecord: {
            amount: 200,
            expenseDate: new Date(),
            category: ExpenseCategory.CLEANING,
            notes: "Initial update record",
          },
          role: "ADMIN",
        }),
      ).rejects.toThrow(NotFoundException);

      await expect(
        farmService.updateLivestockExpenseRecord({
          email: adminInfo.email,
          expenseRecordId: 234,
          expenseRecord: {
            amount: 200,
            expenseDate: new Date(),
            category: ExpenseCategory.CLEANING,
            notes: "Initial update record",
          },
          role: "ADMIN",
        }),
      ).rejects.toThrow("Expense record not found");
    });
  });

  describe("addLivestockSalesRecord", () => {
    it("returns the created sales record when successful", async () => {
      await registerAdmin(adminInfo);

      const farm = await farmService.createFarm({
        ...farmInfo,
        email: adminInfo.email,
      });

      const farmWithBarns = await farmService.addBarnsToFarm({
        email: adminInfo.email,
        farmTag: farm.farm_tag,
        barns: adminInfo.barns,
        role: "ADMIN",
      });

      await farmService.addPensToBarn({
        email: adminInfo.email,
        barnUnitId: farmWithBarns.barns.find((bn) => bn.unit_id === "HN1")
          .unit_id,
        pens: adminInfo.pens,
        role: "ADMIN",
      });

      await farmService.addLivestockToPen({
        email: adminInfo.email,
        penUnitId: adminInfo.pens.find((pn) => pn.unitId === "PEN1").unitId,
        livestock: adminInfo.livestock,
        role: "ADMIN",
      });

      const response = await farmService.addLivestockSalesRecord({
        email: adminInfo.email,
        livestockTag: adminInfo.livestock[0].livestockTag,
        salesRecord: {
          buyerName: "John Doe",
          notes: "Initial sales record",
          pricePerUnit: 10,
          quantity: 10,
          saleDate: new Date(),
          totalAmount: 100,
          unit: "kg",
        },
        role: "ADMIN",
      });

      expect(response).toBeDefined();
      expect(response.price_per_unit).toEqual(10);
      expect(response.quantity).toEqual(10);
      expect(response.total_amount).toEqual(100);
      expect(response.unit).toEqual("kg");
    });

    it("throws an error if livestock does not exist", async () => {
      await expect(
        farmService.addLivestockSalesRecord({
          email: adminInfo.email,
          livestockTag: adminInfo.livestock[0].livestockTag,
          salesRecord: {
            buyerName: "John Doe",
            notes: "Initial sales record",
            pricePerUnit: 10,
            quantity: 10,
            saleDate: new Date(),
            totalAmount: 100,
            unit: "kg",
          },
          role: "ADMIN",
        }),
      ).rejects.toThrow(NotFoundException);

      await expect(
        farmService.addLivestockSalesRecord({
          email: adminInfo.email,
          livestockTag: adminInfo.livestock[0].livestockTag,
          salesRecord: {
            buyerName: "John Doe",
            notes: "Initial sales record",
            pricePerUnit: 10,
            quantity: 10,
            saleDate: new Date(),
            totalAmount: 100,
            unit: "kg",
          },
          role: "ADMIN",
        }),
      ).rejects.toThrow("Livestock not found");
    });
  });

  describe("updateLivestockSalesRecord", () => {
    it("returns the updated sales record when successful", async () => {
      await registerAdmin(adminInfo);

      const farm = await farmService.createFarm({
        ...farmInfo,
        email: adminInfo.email,
      });

      const farmWithBarns = await farmService.addBarnsToFarm({
        email: adminInfo.email,
        farmTag: farm.farm_tag,
        barns: adminInfo.barns,
        role: "ADMIN",
      });

      await farmService.addPensToBarn({
        email: adminInfo.email,
        barnUnitId: farmWithBarns.barns.find((bn) => bn.unit_id === "HN1")
          .unit_id,
        pens: adminInfo.pens,
        role: "ADMIN",
      });

      await farmService.addLivestockToPen({
        email: adminInfo.email,
        penUnitId: adminInfo.pens.find((pn) => pn.unitId === "PEN1").unitId,
        livestock: adminInfo.livestock,
        role: "ADMIN",
      });

      const record = await farmService.addLivestockSalesRecord({
        email: adminInfo.email,
        livestockTag: adminInfo.livestock[0].livestockTag,
        salesRecord: {
          buyerName: "John Doe",
          notes: "Initial sales record",
          pricePerUnit: 10,
          quantity: 10,
          saleDate: new Date(),
          totalAmount: 100,
          unit: "kg",
        },
        role: "ADMIN",
      });

      const response = await farmService.updateLivestockSalesRecord({
        email: adminInfo.email,
        salesRecordId: record.id,
        salesRecord: {
          buyerName: "Jane Doe",
          notes: "Updated sales record",
          pricePerUnit: 15,
          quantity: 15,
          saleDate: new Date(),
          totalAmount: 225,
          unit: "kg",
        },
        role: "ADMIN",
      });

      expect(response).toBeDefined();
      expect(response.buyer_name).toBe("Jane Doe");
      expect(response.notes).toBe("Updated sales record");
      expect(response.price_per_unit).toBe(15);
      expect(response.quantity).toBe(15);
      expect(response.total_amount).toBe(225);
      expect(response.unit).toBe("kg");
    });

    it("throws an error if livestock does not exist", async () => {
      await expect(
        farmService.updateLivestockSalesRecord({
          email: adminInfo.email,
          salesRecordId: 234,
          salesRecord: {
            buyerName: "Jane Doe",
            notes: "Updated sales record",
            pricePerUnit: 15,
            quantity: 15,
            saleDate: new Date(),
            totalAmount: 225,
            unit: "kg",
          },
          role: "ADMIN",
        }),
      ).rejects.toThrow(NotFoundException);

      await expect(
        farmService.updateLivestockSalesRecord({
          email: adminInfo.email,
          salesRecordId: 234,
          salesRecord: {
            buyerName: "Jane Doe",
            notes: "Updated sales record",
            pricePerUnit: 15,
            quantity: 15,
            saleDate: new Date(),
            totalAmount: 225,
            unit: "kg",
          },
          role: "ADMIN",
        }),
      ).rejects.toThrow("Sales record not found");
    });
  });

  describe("markLivestockAsUnavailable", () => {
    it("returns update livestock with status set to unavailable", async () => {
      await registerAdmin(adminInfo);

      const farm = await farmService.createFarm({
        ...farmInfo,
        email: adminInfo.email,
      });

      const farmWithBarns = await farmService.addBarnsToFarm({
        email: adminInfo.email,
        farmTag: farm.farm_tag,
        barns: adminInfo.barns,
        role: "ADMIN",
      });

      await farmService.addPensToBarn({
        email: adminInfo.email,
        barnUnitId: farmWithBarns.barns.find((bn) => bn.unit_id === "HN1")
          .unit_id,
        pens: adminInfo.pens,
        role: "ADMIN",
      });

      await farmService.addLivestockToPen({
        email: adminInfo.email,
        penUnitId: adminInfo.pens.find((pn) => pn.unitId === "PEN1").unitId,
        livestock: adminInfo.livestock,
        role: "ADMIN",
      });

      const response = await farmService.markLivestockAsUnavailable({
        email: adminInfo.email,
        livestockTag: adminInfo.livestock[0].livestockTag,
        unavailabilityReason: LivestockUnavailabilityReason.DEAD,
        role: "ADMIN",
      });

      expect(response.availability_status).toEqual(
        LivestockAvailabilityStatus.UNAVAILABLE,
      );
      expect(response.unavailability_reason).toEqual(
        LivestockUnavailabilityReason.DEAD,
      );

      // only list available livestock
      const response2 = await farmService.listLivestock({
        email: adminInfo.email,
        searchTerm: "",
        role: "ADMIN",
      });

      expect(response2).toHaveLength(1);
      expect(response2[0].availability_status).toEqual(
        LivestockAvailabilityStatus.AVAILABLE,
      );
    });
    it("throws an error if livestock not found", async () => {
      await expect(
        farmService.markLivestockAsUnavailable({
          email: adminInfo.email,
          livestockTag: "invalid-tag",
          unavailabilityReason: LivestockUnavailabilityReason.SOLD,
          role: "ADMIN",
        }),
      ).rejects.toThrow(NotFoundException);

      await expect(
        farmService.markLivestockAsUnavailable({
          email: adminInfo.email,
          livestockTag: "invalid-tag",
          unavailabilityReason: LivestockUnavailabilityReason.SOLD,
          role: "ADMIN",
        }),
      ).rejects.toThrow("Livestock not found");
    });
  });

  describe("createTask", () => {
    it("returns a task after creation", async () => {
      await setupForQueries();

      let admin = await getAdmin(adminInfo.email);

      let response = await farmService.createTask({
        email: adminInfo.email,
        farmTag: admin.farms[0].farm_tag,
        task: {
          description: "Test Task Description",
          startingDate: new Date(),
          completionDate: new Date(),
          type: TaskType.REGULAR_INSPECTION,
          notes: "Test Task Notes",
          status: TaskStatus.PENDING,
        },
        role: "ADMIN",
      });

      expect(response).toBeDefined();
      expect(response.type).toBe(TaskType.REGULAR_INSPECTION);
      expect(response.status).toBe(TaskStatus.PENDING);
      expect(response.farm).toBeDefined();
      expect(response.farm.farm_tag).toEqual(admin.farms[0].farm_tag);

      admin = await getAdmin(adminInfo.email);
      expect(admin.assigned_tasks).toHaveLength(1);

      response = await farmService.createTask({
        email: adminInfo.email,
        farmTag: admin.farms[0].farm_tag,
        task: {
          description: "Test Task Description",
          startingDate: new Date(),
          completionDate: new Date(),
          type: TaskType.REGULAR_INSPECTION,
          notes: "Test Task Notes",
          status: TaskStatus.PENDING,
        },
        role: "ADMIN",
      });

      expect(response).toBeDefined();
      expect(response.type).toBe(TaskType.REGULAR_INSPECTION);
      expect(response.status).toBe(TaskStatus.PENDING);
      expect(response.farm).toBeDefined();
      expect(response.farm.farm_tag).toEqual(admin.farms[0].farm_tag);

      admin = await getAdmin(adminInfo.email);
      expect(admin.assigned_tasks).toHaveLength(2);

      response = await farmService.createTask({
        email: adminInfo.workers[1].email,
        farmTag: admin.farms[0].farm_tag,
        task: {
          description: "Test Task Description",
          startingDate: new Date(),
          completionDate: new Date(),
          type: TaskType.REGULAR_INSPECTION,
          notes: "Test Task Notes",
          status: TaskStatus.PENDING,
        },
        role: "WORKER",
      });

      expect(response).toBeDefined();
      expect(response.type).toBe(TaskType.REGULAR_INSPECTION);
      expect(response.status).toBe(TaskStatus.PENDING);
      expect(response.farm).toBeDefined();
      expect(response.farm.farm_tag).toEqual(admin.farms[0].farm_tag);

      admin = await getAdmin(adminInfo.email);
      expect(admin.assigned_tasks).toHaveLength(3);
    });

    it("throws an error when admin with email or farmTag not found", async () => {
      await registerAdmin(adminInfo);

      await expect(
        farmService.createTask({
          email: adminInfo.email,
          farmTag: "beeb7d59-3583-450d-9045-33c4bdb58f87",
          task: {
            description: "Test Task Description",
            startingDate: new Date(),
            completionDate: new Date(),
            type: TaskType.REGULAR_INSPECTION,
            notes: "Test Task Notes",
            status: TaskStatus.PENDING,
          },
          role: "ADMIN",
        }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        farmService.createTask({
          email: adminInfo.email,
          farmTag: "beeb7d59-3583-450d-9045-33c4bdb58f87",
          task: {
            description: "Test Task Description",
            startingDate: new Date(),
            completionDate: new Date(),
            type: TaskType.REGULAR_INSPECTION,
            notes: "Test Task Notes",
            status: TaskStatus.PENDING,
          },
          role: "ADMIN",
        }),
      ).rejects.toThrow("Admin with provided email or farmTag not found");
    });
  });

  describe("updateTask", () => {
    it("returns a task after updating", async () => {
      await setupForQueries();

      const admin = await getAdmin(adminInfo.email);

      const task = await farmService.createTask({
        email: adminInfo.email,
        farmTag: admin.farms[0].farm_tag,
        task: {
          description: "Test Task Description",
          startingDate: new Date(),
          completionDate: new Date(),
          type: TaskType.REGULAR_INSPECTION,
          notes: "Test Task Notes",
          status: TaskStatus.PENDING,
        },
        role: "ADMIN",
      });

      let response = await farmService.updateTask({
        email: adminInfo.email,
        taskId: task.id,
        task: {
          startingDate: new Date(),
          completionDate: new Date(),
          notes: "Updated Task Notes",
        },
        role: "ADMIN",
      });

      expect(response).toBeDefined();
      expect(response.notes).toBe("Updated Task Notes");

      response = await farmService.updateTask({
        email: adminInfo.workers[1].email,
        taskId: task.id,
        task: {
          startingDate: new Date(),
          completionDate: new Date(),
          notes: "Updated Task Notes 2",
        },
        role: "WORKER",
      });

      expect(response).toBeDefined();
      expect(response.notes).toBe("Updated Task Notes 2");
    });

    it("throws an error if task not found", async () => {
      await registerAdmin(adminInfo);

      await expect(
        farmService.updateTask({
          email: adminInfo.email,
          taskId: 999999,
          task: {
            startingDate: new Date(),
            completionDate: new Date(),
            notes: "Updated Task Notes",
          },
          role: "ADMIN",
        }),
      ).rejects.toThrow(NotFoundException);

      await expect(
        farmService.updateTask({
          email: adminInfo.email,
          taskId: 999999,
          task: {
            startingDate: new Date(),
            completionDate: new Date(),
            notes: "Updated Task Notes",
          },
          role: "ADMIN",
        }),
      ).rejects.toThrow("Task not found");
    });
  });

  describe("updateTaskProgress", () => {
    it("returns a task after updating it's progress", async () => {
      await setupForQueries();
      const admin = await getAdmin(adminInfo.email);

      const task = await farmService.createTask({
        email: adminInfo.email,
        farmTag: admin.farms[0].farm_tag,
        task: {
          description: "Test Task Description",
          startingDate: new Date(),
          completionDate: new Date(),
          type: TaskType.REGULAR_INSPECTION,
          notes: "Test Task Notes",
          status: TaskStatus.PENDING,
        },
        role: "ADMIN",
      });

      await farmService.assignTaskToWorker({
        email: adminInfo.email,
        taskId: task.id,
        workerTag: admin.workers[0].worker_tag,
        role: "ADMIN",
      });

      const response = await farmService.updateTaskProgress({
        email: admin.workers[0].email,
        taskId: task.id,
        task: {
          startedAt: new Date(),
          status: TaskStatus.IN_PROGRESS,
        },
      });

      expect(response).toBeDefined();
      expect(response.status).toBe(TaskStatus.IN_PROGRESS);
    });

    it("throws an error if task not found", async () => {
      await registerAdmin(adminInfo);

      await expect(
        farmService.updateTaskProgress({
          email: adminInfo.workers[0].email,
          taskId: 1,
          task: {
            startedAt: new Date(),
            status: TaskStatus.IN_PROGRESS,
          },
        }),
      ).rejects.toThrow(NotFoundException);

      await expect(
        farmService.updateTaskProgress({
          email: adminInfo.workers[0].email,
          taskId: 1,
          task: {
            startedAt: new Date(),
            status: TaskStatus.IN_PROGRESS,
          },
        }),
      ).rejects.toThrow("Task not found");
    });

    it("throws an error if completedAt is not provided when completing a stask", async () => {
      await setupForQueries();
      const admin = await getAdmin(adminInfo.email);

      const task = await farmService.createTask({
        email: adminInfo.email,
        farmTag: admin.farms[0].farm_tag,
        task: {
          description: "Test Task Description",
          startingDate: new Date(),
          completionDate: new Date(),
          type: TaskType.REGULAR_INSPECTION,
          notes: "Test Task Notes",
          status: TaskStatus.PENDING,
        },
        role: "ADMIN",
      });

      await farmService.assignTaskToWorker({
        email: adminInfo.email,
        taskId: task.id,
        workerTag: admin.workers[0].worker_tag,
        role: "ADMIN",
      });

      await expect(
        farmService.updateTaskProgress({
          email: admin.workers[0].email,
          taskId: task.id,
          task: {
            startedAt: new Date(),
            status: TaskStatus.COMPLETED,
          },
        }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        farmService.updateTaskProgress({
          email: admin.workers[0].email,
          taskId: task.id,
          task: {
            startedAt: new Date(),
            status: TaskStatus.COMPLETED,
          },
        }),
      ).rejects.toThrow(
        "Completion date must be provided when task is been completed",
      );
    });
  });

  describe("assignTaskToWorker", () => {
    it("returns task with assigned workers after assigning task", async () => {
      await setupForQueries();
      let admin = await getAdmin(adminInfo.email);

      let task = await farmService.createTask({
        email: adminInfo.email,
        farmTag: admin.farms[0].farm_tag,
        task: {
          description: "Test Task Description",
          startingDate: new Date(),
          completionDate: new Date(),
          type: TaskType.REGULAR_INSPECTION,
          notes: "Test Task Notes",
          status: TaskStatus.PENDING,
        },
        role: "ADMIN",
      });

      let response = await farmService.assignTaskToWorker({
        email: adminInfo.email,
        taskId: task.id,
        workerTag: admin.workers[0].worker_tag,
        role: "ADMIN",
      });

      expect(response).toBeDefined();
      expect(response.worker.worker_tag).toEqual(admin.workers[0].worker_tag);

      admin = await getAdmin(adminInfo.email);
      expect(
        admin.workers.find(
          (worker) => worker.worker_tag === response.worker.worker_tag,
        ).assigned_tasks,
      ).toHaveLength(1);

      // worker
      task = await farmService.createTask({
        email: adminInfo.workers[1].email,
        farmTag: admin.farms[0].farm_tag,
        task: {
          description: "Test Task Description",
          startingDate: new Date(),
          completionDate: new Date(),
          type: TaskType.REGULAR_INSPECTION,
          notes: "Test Task Notes",
          status: TaskStatus.PENDING,
        },
        role: "WORKER",
      });

      response = await farmService.assignTaskToWorker({
        email: adminInfo.workers[1].email,
        taskId: task.id,
        workerTag: admin.workers[0].worker_tag,
        role: "WORKER",
      });

      expect(response).toBeDefined();
      expect(response.worker.worker_tag).toEqual(admin.workers[0].worker_tag);

      admin = await getAdmin(adminInfo.email);
      expect(
        admin.workers.find(
          (worker) => worker.worker_tag === response.worker.worker_tag,
        ).assigned_tasks,
      ).toHaveLength(2);
    });

    it("throws an error if task not found", async () => {
      await setupForQueries();
      const admin = await getAdmin(adminInfo.email);

      await expect(
        farmService.assignTaskToWorker({
          email: adminInfo.email,
          taskId: 1,
          workerTag: admin.workers[0].worker_tag,
          role: "ADMIN",
        }),
      ).rejects.toThrow(NotFoundException);

      await expect(
        farmService.assignTaskToWorker({
          email: adminInfo.email,
          taskId: 1,
          workerTag: admin.workers[0].worker_tag,
          role: "ADMIN",
        }),
      ).rejects.toThrow("Task not found");
    });

    it("throws an error if worker not found", async () => {
      await setupForQueries();
      const admin = await getAdmin(adminInfo.email);

      const task = await farmService.createTask({
        email: adminInfo.email,
        farmTag: admin.farms[0].farm_tag,
        task: {
          description: "Test Task Description",
          startingDate: new Date(),
          completionDate: new Date(),
          type: TaskType.REGULAR_INSPECTION,
          notes: "Test Task Notes",
          status: TaskStatus.PENDING,
        },
        role: "ADMIN",
      });

      await expect(
        farmService.assignTaskToWorker({
          email: adminInfo.email,
          taskId: task.id,
          workerTag: "6eb3ca36-f74e-45f0-ae70-e17ad0a4c57d",
          role: "ADMIN",
        }),
      ).rejects.toThrow(NotFoundException);

      await expect(
        farmService.assignTaskToWorker({
          email: adminInfo.email,
          taskId: task.id,
          workerTag: "6eb3ca36-f74e-45f0-ae70-e17ad0a4c57d",
          role: "ADMIN",
        }),
      ).rejects.toThrow("Worker not found");
    });
  });

  describe("updateWorker", () => {
    it("updates worker entity", async () => {
      await setupForQueries();
      const admin = await getAdmin(adminInfo.email);

      let response = await farmService.updateWorker({
        email: admin.email,
        workerTag: admin.workers[0].worker_tag,
        workerData: {
          name: "Updated Worker Name",
          phone: "1234567890",
          achievements: [
            { name: "Achievement 1", date: new Date() },
            { name: "Achievement 2", date: new Date() },
          ],
        },
        role: "ADMIN",
      });

      expect(response).toBeDefined();
      expect(response.name).toEqual("Updated Worker Name");
      expect(response.phone).toEqual("1234567890");
      expect(response.achievements).toHaveLength(2);

      response = await farmService.updateWorker({
        email: adminInfo.workers[1].email,
        workerTag: admin.workers[0].worker_tag,
        workerData: {
          name: "Updated Worker Name 2",
          phone: "1234567890",
          achievements: [
            { name: "Achievement 1", date: new Date() },
            { name: "Achievement 2", date: new Date() },
          ],
        },
        role: "WORKER",
      });

      expect(response).toBeDefined();
      expect(response.name).toEqual("Updated Worker Name 2");
      expect(response.phone).toEqual("1234567890");
      expect(response.achievements).toHaveLength(2);
    });
  });

  // Queries
  describe("listFarms", () => {
    it("should return a list of farms", async () => {
      await setupForQueries();

      await farmService.createFarm({
        ...farmInfo,
        name: "Fred Farms 2",
        email: adminInfo.email,
      });

      let farms = await farmService.listFarms({
        email: adminInfo.email,
        searchTerm: "",
        role: "ADMIN",
      });

      expect(farms).toHaveLength(2);

      farms = await farmService.listFarms({
        email: adminInfo.email,
        searchTerm: "Fred Farms 1",
        role: "ADMIN",
      });

      expect(farms).toHaveLength(1);
      expect(farms[0].name).toBe("Fred Farms 1");

      farms = await farmService.listFarms({
        email: adminInfo.email,
        searchTerm: "Fred Farms 1",
        filter: { id: farms[0].id },
        role: "ADMIN",
      });

      expect(farms).toHaveLength(1);
      expect(farms[0].name).toBe("Fred Farms 1");
    });
  });

  describe("listBarns", () => {
    it("should return a list of barns", async () => {
      await setupForQueries();

      let barns = await farmService.listBarns({
        email: adminInfo.email,
        searchTerm: "",
        role: "ADMIN",
      });

      expect(barns).toHaveLength(2);
      expect(barns.map((barn) => barn.unit_id)).toContain("HN1");

      barns = await farmService.listBarns({
        email: adminInfo.email,
        searchTerm: "Fred Barn 1",
        role: "ADMIN",
      });

      expect(barns).toHaveLength(1);
      expect(barns[0].name).toContain("Fred Barn 1");
    });
  });

  describe("getBarn", () => {
    it("should return barn with provided unit id", async () => {
      await setupForQueries();

      const barn = await farmService.getBarn({
        email: adminInfo.email,
        barnUnitId: adminInfo.barns[0].unitId,
        role: "ADMIN",
      });

      expect(barn).toBeDefined();
      expect(barn.name).toContain("Fred Barn 1");
    });
  });

  describe("lisPens", () => {
    it("should return a list of pens", async () => {
      await setupForQueries();

      let pens = await farmService.listPens({
        email: adminInfo.email,
        searchTerm: "",
        role: "ADMIN",
      });

      expect(pens).toHaveLength(2);
      expect(pens.map((pen) => pen.unit_id)).toContain("PEN1");

      pens = await farmService.listPens({
        email: adminInfo.email,
        searchTerm: "Fred Pen 1",
        role: "ADMIN",
      });

      expect(pens).toHaveLength(1);
      expect(pens[0].name).toContain("Fred Pen 1");
    });
  });

  describe("getPen", () => {
    it("should return pen with provided unit id", async () => {
      await setupForQueries();

      const pen = await farmService.getPen({
        email: adminInfo.email,
        penUnitId: adminInfo.pens[0].unitId,
        role: "ADMIN",
      });

      expect(pen).toBeDefined();
      expect(pen.name).toContain("Fred Pen 1");
    });
  });

  describe("listLivestock", () => {
    it("should return a list of livestock", async () => {
      await setupForQueries();

      let livestock = await farmService.listLivestock({
        email: adminInfo.email,
        searchTerm: "",
        role: "ADMIN",
      });

      expect(livestock).toHaveLength(2);
      expect(livestock.map((livestock) => livestock.livestock_tag)).toContain(
        "LST1",
      );

      livestock = await farmService.listLivestock({
        email: adminInfo.email,
        searchTerm: "LST1",
        role: "ADMIN",
      });

      expect(livestock).toHaveLength(1);
      expect(livestock[0].livestock_tag).toContain("LST1");

      // filter by type
      livestock = await farmService.listLivestock({
        email: adminInfo.email,
        searchTerm: "",
        filter: {
          livestock_type: LivestockType.GRASSCUTTER,
        },
        role: "ADMIN",
      });

      expect(livestock).toHaveLength(2);

      livestock = await farmService.listLivestock({
        email: adminInfo.email,
        searchTerm: "",
        filter: {
          livestock_type: LivestockType.CATTLE,
        },
        role: "ADMIN",
      });

      expect(livestock).toHaveLength(0);
    });
  });

  describe("getLivestock", () => {
    it("should return livestock with provided unit id", async () => {
      await setupForQueries();

      const livestock = await farmService.getLivestock({
        email: adminInfo.email,
        livestockTag: adminInfo.livestock[0].livestockTag,
        role: "ADMIN",
      });

      expect(livestock).toBeDefined();
      expect(livestock.livestock_tag).toContain(
        adminInfo.livestock[0].livestockTag,
      );
    });
  });

  describe("listWorkers", () => {
    it("should return a list of workers for the admin", async () => {
      await setupForQueries();
      const workers = await farmService.listWorkers({
        email: adminInfo.email,
        searchTerm: "",
      });

      const admin = await getAdmin(adminInfo.email);

      expect(workers).toHaveLength(2);
      expect(admin.workers).toHaveLength(2);
    });
  });

  describe("getWorker", () => {
    it("should return a worker for the admin", async () => {
      await setupForQueries();

      const workers = await farmService.listWorkers({
        email: adminInfo.email,
        searchTerm: "",
      });

      const worker = await farmService.getWorker({
        email: adminInfo.email,
        workerTag: workers[0].worker_tag,
        role: "ADMIN",
      });

      expect(worker).toBeDefined();
      expect(worker.email).toEqual(workers[0].email);
    });
  });

  describe("listTask", () => {
    it("returns a list of tasks for admin", async () => {
      await setupForQueries();

      const farm = await farmService.createFarm({
        ...farmInfo,
        email: adminInfo.email,
      });

      await farmService.createTask({
        email: adminInfo.email,
        farmTag: farm.farm_tag,
        task: {
          description: "Test Task Description",
          startingDate: new Date(),
          completionDate: new Date(),
          type: TaskType.REGULAR_INSPECTION,
          notes: "Test Task Notes",
          status: TaskStatus.PENDING,
        },
        role: "ADMIN",
      });

      const response = await farmService.listTask({
        email: adminInfo.email,
        role: "ADMIN",
      });

      expect(response).toHaveLength(1);
    });
  });

  const adminInfo = {
    name: "Frederick Aziebu",
    email: "frederickaziebu1998@gmail.com",
    password: "Microsoft@2021",
    workers: [
      {
        name: "John Doe",
        email: "johndoe@gmail.com",
        roles: [WorkerRole.VETERINARIAN, WorkerRole.FEED_SPECIALIST],
      },

      {
        name: "Delali Dorwu",
        email: "delalidorwu@gmail.com",
        roles: [WorkerRole.FARM_MANAGER, WorkerRole.ANIMAL_CARETAKER],
      },
    ],
    barns: [
      {
        areaSqm: 200,
        climateControlled: true,
        capacity: 20,
        name: "Fred Barn 1",
        unitId: "HN1",
      },
      {
        areaSqm: 4300,
        climateControlled: false,
        capacity: 65,
        name: "Fred Barn 2",
        unitId: "HN2",
      },
    ],
    pens: [
      {
        areaSqm: 200,
        capacity: 20,
        name: "Fred Pen 1",
        unitId: "PEN1",
      },
      {
        areaSqm: 200,
        capacity: 20,
        name: "Fred Pen 2",
        unitId: "PEN2",
      },
    ],
    livestock: [
      {
        livestockTag: "LST1",
        livestockType: LivestockType.GRASSCUTTER,
        birthDate: new Date(),
        breed: "WHITE",
        gender: LivestockGender.MALE,
        weight: 20,
      },
      {
        livestockTag: "LST2",
        livestockType: LivestockType.GRASSCUTTER,
        birthDate: new Date(),
        breed: "BLACK",
        gender: LivestockGender.FEMALE,
        weight: 32,
      },
    ],
  };

  const farmInfo = {
    name: "Fred Farms 1",
    location: "Kpong",
    area: "20 acres",
    farmType: FarmType.LIVESTOCK,
    latitude: 0.0,
    longitude: 0.01,
  };

  const getAdmin = async (email: string) => {
    const admin = await adminRepository.findOne({
      where: { email },
      relations: [
        "farms",
        "assigned_tasks",
        "workers.assigned_tasks",
        "workers.assigned_reviews",
      ],
    });

    return admin;
  };

  const registerAdmin = async ({ name, email, password }) => {
    const admin = new Admin();

    admin.name = name;
    admin.email = email;
    admin.password = await HashHelper.encrypt(password);

    return await adminRepository.save(admin);
  };

  const setupForQueries = async () => {
    const admin = await registerAdmin(adminInfo);

    // create farm
    const farm = await farmService.createFarm({
      ...farmInfo,
      email: adminInfo.email,
    });

    // add workers to farm
    await farmService.addWorkersToFarm({
      email: adminInfo.email,
      farmTag: farm.farm_tag,
      workers: adminInfo.workers,
      role: "ADMIN",
    });

    // add barns to farm
    const farmWithBarns = await farmService.addBarnsToFarm({
      email: adminInfo.email,
      farmTag: farm.farm_tag,
      barns: adminInfo.barns,
      role: "ADMIN",
    });

    // add pens to farm
    await farmService.addPensToBarn({
      email: adminInfo.email,
      barnUnitId: farmWithBarns.barns.find((bn) => bn.unit_id === "HN1")
        .unit_id,
      pens: adminInfo.pens,
      role: "ADMIN",
    });

    // add livestock to pen
    await farmService.addLivestockToPen({
      email: adminInfo.email,
      penUnitId: adminInfo.pens.find((pn) => pn.unitId === "PEN1").unitId,
      livestock: adminInfo.livestock,
      role: "ADMIN",
    });

    // add livestock breeding record
    await farmService.addLivestockBreedingRecord({
      email: adminInfo.email,
      maleLivestockTag: adminInfo.livestock[0].livestockTag,
      femaleLivestockTag: adminInfo.livestock[1].livestockTag,
      breedingRecord: {
        matingDate: new Date(),
        expectedDelivery: new Date(),
        status: BreedingStatus.PLANNED,
      },
      role: "ADMIN",
    });

    // add livestock health record
    await farmService.addLivestockHealthRecord({
      email: adminInfo.email,
      livestockTag: adminInfo.livestock[0].livestockTag,
      healthRecord: {
        cost: 20,
        diagnosis: "Healthy",
        issue: "None",
        notes: "None",
        symptoms: "None",
        treatment: "None",
        recordDate: new Date(),
        recordStatus: HealthRecordStatus.HEALTHY,
      },
      role: "ADMIN",
    });

    // add livestock growth record
    await farmService.addLivestockGrowthRecord({
      email: adminInfo.email,
      livestockTag: adminInfo.livestock[0].livestockTag,
      growthRecord: {
        notes: "Initial growth record",
        recordDate: new Date(),
        weight: 100,
        period: GrowthPeriod.BIRTH,
      },
      role: "ADMIN",
    });

    // add livestock expense record
    await farmService.addLivestockExpenseRecord({
      email: adminInfo.email,
      livestockTag: adminInfo.livestock[0].livestockTag,
      expenseRecord: {
        amount: 100,
        expenseDate: new Date(),
        category: ExpenseCategory.FEED,
        notes: "Initial expense record",
      },
      role: "ADMIN",
    });

    return { admin, farm };
  };
});
