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
} from "../../database/entities";
import { FarmType } from "../../database/types/farm.type";
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { WorkerRole } from "../../database/types/worker.type";
import { LivestockGender } from "../../database/types";
import { LivestockType } from "../../database/entities/livestock.entity";
import { BreedingStatus } from "../../database/types/breeding-record.type";
import { GrowthPeriod } from "../../database/types/growth-record.type";
import { ExpenseCategory } from "../../database/types/expense-record.type";

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
      await registerAdmin(adminInfo);

      const farm = await farmService.createFarm({
        ...farmInfo,
        email: adminInfo.email,
      });

      const response = await farmService.updateFarm({
        ...farmInfo,
        farmTag: farm.farm_tag,
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
        farmService.updateFarm({
          ...farmInfo,
          farmTag: "52c13e61-be8e-4b8b-8da8-dd0940f87906",
          email: adminInfo.email,
        }),
      ).rejects.toThrow(NotFoundException);

      await expect(
        farmService.updateFarm({
          ...farmInfo,
          farmTag: "52c13e61-be8e-4b8b-8da8-dd0940f87906",
          email: adminInfo.email,
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
        }),
      ).rejects.toThrow(NotFoundException);

      await expect(
        farmService.addWorkersToFarm({
          email: adminInfo.email,
          farmTag: "52c13e61-be8e-4b8b-8da8-dd0940f87906",
          workers: adminInfo.workers,
        }),
      ).rejects.toThrow("Farm not found");

      await expect(
        farmService.addWorkersToFarm({
          email: "fkaaziebu1998@gmail.com",
          farmTag: "52c13e61-be8e-4b8b-8da8-dd0940f87906",
          workers: adminInfo.workers,
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
      });

      await expect(
        farmService.addWorkersToFarm({
          email: adminInfo.email,
          farmTag: farm.farm_tag,
          workers: adminInfo.workers,
        }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        farmService.addWorkersToFarm({
          email: adminInfo.email,
          farmTag: farm.farm_tag,
          workers: adminInfo.workers,
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
      });

      expect(response.workers.length).toEqual(2);
    });
  });

  describe("addBarnsToFarm", () => {
    it("returns farm with barns when barns added successfully", async () => {
      await registerAdmin(adminInfo);

      const farm = await farmService.createFarm({
        ...farmInfo,
        email: adminInfo.email,
      });

      const response = await farmService.addBarnsToFarm({
        email: adminInfo.email,
        farmTag: farm.farm_tag,
        barns: adminInfo.barns,
      });

      expect(response.barns.length).toEqual(2);
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
        }),
      ).rejects.toThrow("Barn not found");
    });
  });

  describe("addPensToBarn", () => {
    it("returns barn with pen when pen added successfully", async () => {
      await registerAdmin(adminInfo);

      const farm = await farmService.createFarm({
        ...farmInfo,
        email: adminInfo.email,
      });

      const farmWithBarns = await farmService.addBarnsToFarm({
        email: adminInfo.email,
        farmTag: farm.farm_tag,
        barns: adminInfo.barns,
      });

      const response = await farmService.addPensToBarn({
        email: adminInfo.email,
        barnUnitId: farmWithBarns.barns.find((bn) => bn.unit_id === "HN1")
          .unit_id,
        pens: adminInfo.pens,
      });

      expect(response.pens.length).toEqual(2);
    });
  });

  describe("updatePen", () => {
    it("returns pen when pen added successfully", async () => {
      await registerAdmin(adminInfo);

      const farm = await farmService.createFarm({
        ...farmInfo,
        email: adminInfo.email,
      });

      const farmWithBarns = await farmService.addBarnsToFarm({
        email: adminInfo.email,
        farmTag: farm.farm_tag,
        barns: adminInfo.barns,
      });

      await farmService.addPensToBarn({
        email: adminInfo.email,
        barnUnitId: farmWithBarns.barns.find((bn) => bn.unit_id === "HN1")
          .unit_id,
        pens: adminInfo.pens,
      });

      const response = await farmService.updatePen({
        email: adminInfo.email,
        penUnitId: adminInfo.pens.find((pn) => pn.unitId === "PEN1").unitId,
        pen: {
          ...adminInfo.pens.find((pn) => pn.unitId === "PEN1"),
          name: "Fred Pen 1 updated",
        },
      });

      expect(response.name).toBe("Fred Pen 1 updated");
    });
  });

  describe("addLivestockToPen", () => {
    it("returns pen with livestock when added successfully", async () => {
      await registerAdmin(adminInfo);

      const farm = await farmService.createFarm({
        ...farmInfo,
        email: adminInfo.email,
      });

      const farmWithBarns = await farmService.addBarnsToFarm({
        email: adminInfo.email,
        farmTag: farm.farm_tag,
        barns: adminInfo.barns,
      });

      await farmService.addPensToBarn({
        email: adminInfo.email,
        barnUnitId: farmWithBarns.barns.find((bn) => bn.unit_id === "HN1")
          .unit_id,
        pens: adminInfo.pens,
      });

      const response = await farmService.addLivestockToPen({
        email: adminInfo.email,
        penUnitId: adminInfo.pens.find((pn) => pn.unitId === "PEN1").unitId,
        livestock: adminInfo.livestock,
      });

      expect(response.livestock.length).toEqual(2);
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
      });

      await farmService.addPensToBarn({
        email: adminInfo.email,
        barnUnitId: farmWithBarns.barns.find((bn) => bn.unit_id === "HN1")
          .unit_id,
        pens: adminInfo.pens,
      });

      await farmService.addLivestockToPen({
        email: adminInfo.email,
        penUnitId: adminInfo.pens.find((pn) => pn.unitId === "PEN1").unitId,
        livestock: adminInfo.livestock,
      });

      await expect(
        farmService.addLivestockToPen({
          email: adminInfo.email,
          penUnitId: adminInfo.pens.find((pn) => pn.unitId === "PEN1").unitId,
          livestock: [adminInfo.livestock[0]],
        }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        farmService.addLivestockToPen({
          email: adminInfo.email,
          penUnitId: adminInfo.pens.find((pn) => pn.unitId === "PEN1").unitId,
          livestock: [adminInfo.livestock[0]],
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
        }),
      ).rejects.toThrow(NotFoundException);

      await expect(
        farmService.addLivestockToPen({
          email: adminInfo.email,
          penUnitId: adminInfo.pens.find((pn) => pn.unitId === "PEN1").unitId,
          livestock: adminInfo.livestock,
        }),
      ).rejects.toThrow("Pen not found");
    });
  });

  describe("updateLivestock", () => {
    it("returns updated livestock when successful", async () => {
      await registerAdmin(adminInfo);

      const farm = await farmService.createFarm({
        ...farmInfo,
        email: adminInfo.email,
      });

      const farmWithBarns = await farmService.addBarnsToFarm({
        email: adminInfo.email,
        farmTag: farm.farm_tag,
        barns: adminInfo.barns,
      });

      await farmService.addPensToBarn({
        email: adminInfo.email,
        barnUnitId: farmWithBarns.barns.find((bn) => bn.unit_id === "HN1")
          .unit_id,
        pens: adminInfo.pens,
      });

      await farmService.addLivestockToPen({
        email: adminInfo.email,
        penUnitId: adminInfo.pens.find((pn) => pn.unitId === "PEN1").unitId,
        livestock: [
          ...adminInfo.livestock,
          {
            livestockTag: "LST3",
            livestockType: LivestockType.GRASSCUTTER,
            birthDate: new Date(),
            breed: "WHITE",
            gender: LivestockGender.MALE,
            weight: 20,
          },
        ],
      });

      const response = await farmService.updateLivestock({
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
      });

      expect(response.mother.livestock_tag).toBe(
        adminInfo.livestock[1].livestockTag,
      );

      expect(response.father.livestock_tag).toBe(
        adminInfo.livestock[0].livestockTag,
      );

      const motherLivestock = await farmService.getLivestock({
        email: adminInfo.email,
        livestockTag: response.mother.livestock_tag,
      });

      expect(motherLivestock.maternalOffspring.length).toBe(1);
      expect(motherLivestock.maternalOffspring[0].livestock_tag).toBe("LST3");

      const fatherLivestock = await farmService.getLivestock({
        email: adminInfo.email,
        livestockTag: response.father.livestock_tag,
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
      });

      await farmService.addPensToBarn({
        email: adminInfo.email,
        barnUnitId: farmWithBarns.barns.find((bn) => bn.unit_id === "HN1")
          .unit_id,
        pens: adminInfo.pens,
      });

      await farmService.addLivestockToPen({
        email: adminInfo.email,
        penUnitId: adminInfo.pens.find((pn) => pn.unitId === "PEN1").unitId,
        livestock: adminInfo.livestock,
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
      });

      await farmService.addPensToBarn({
        email: adminInfo.email,
        barnUnitId: farmWithBarns.barns.find((bn) => bn.unit_id === "HN1")
          .unit_id,
        pens: adminInfo.pens,
      });

      await farmService.addLivestockToPen({
        email: adminInfo.email,
        penUnitId: adminInfo.pens.find((pn) => pn.unitId === "PEN1").unitId,
        livestock: adminInfo.livestock,
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
      });

      await farmService.addPensToBarn({
        email: adminInfo.email,
        barnUnitId: farmWithBarns.barns.find((bn) => bn.unit_id === "HN1")
          .unit_id,
        pens: adminInfo.pens,
      });

      await farmService.addLivestockToPen({
        email: adminInfo.email,
        penUnitId: adminInfo.pens.find((pn) => pn.unitId === "PEN1").unitId,
        livestock: [adminInfo.livestock[0]],
      });

      await farmService.addLivestockToPen({
        email: adminInfo.email,
        penUnitId: adminInfo.pens.find((pn) => pn.unitId === "PEN2").unitId,
        livestock: [adminInfo.livestock[1]],
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
      });

      await farmService.addPensToBarn({
        email: adminInfo.email,
        barnUnitId: farmWithBarns.barns.find((bn) => bn.unit_id === "HN1")
          .unit_id,
        pens: adminInfo.pens,
      });

      await farmService.addLivestockToPen({
        email: adminInfo.email,
        penUnitId: adminInfo.pens.find((pn) => pn.unitId === "PEN1").unitId,
        livestock: adminInfo.livestock,
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
      });

      const response = await farmService.updateLivestockBreedingRecord({
        email: adminInfo.email,
        breedingRecordId: record.id,
        breedingRecord: {
          matingDate: new Date(),
          expectedDelivery: new Date(),
          status: BreedingStatus.IN_PROGRESS,
          offspringCountMale: 2,
          offspringCountFemale: 3,
        },
      });

      expect(response).toBeDefined();
      expect(response.offspring_count_male).toEqual(2);
      expect(response.offspring_count_female).toEqual(3);
      expect(response.status).toEqual(BreedingStatus.IN_PROGRESS);
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
            offspringCountMale: 2,
            offspringCountFemale: 3,
          },
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
            offspringCountMale: 2,
            offspringCountFemale: 3,
          },
        }),
      ).rejects.toThrow("Breeding record not found");
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
      });

      await farmService.addPensToBarn({
        email: adminInfo.email,
        barnUnitId: farmWithBarns.barns.find((bn) => bn.unit_id === "HN1")
          .unit_id,
        pens: adminInfo.pens,
      });

      await farmService.addLivestockToPen({
        email: adminInfo.email,
        penUnitId: adminInfo.pens.find((pn) => pn.unitId === "PEN1").unitId,
        livestock: adminInfo.livestock,
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
        },
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
          },
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
          },
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
      });

      await farmService.addPensToBarn({
        email: adminInfo.email,
        barnUnitId: farmWithBarns.barns.find((bn) => bn.unit_id === "HN1")
          .unit_id,
        pens: adminInfo.pens,
      });

      await farmService.addLivestockToPen({
        email: adminInfo.email,
        penUnitId: adminInfo.pens.find((pn) => pn.unitId === "PEN1").unitId,
        livestock: adminInfo.livestock,
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
        },
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
          },
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
          },
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
      });

      await farmService.addPensToBarn({
        email: adminInfo.email,
        barnUnitId: farmWithBarns.barns.find((bn) => bn.unit_id === "HN1")
          .unit_id,
        pens: adminInfo.pens,
      });

      await farmService.addLivestockToPen({
        email: adminInfo.email,
        penUnitId: adminInfo.pens.find((pn) => pn.unitId === "PEN1").unitId,
        livestock: adminInfo.livestock,
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
      });

      await farmService.addPensToBarn({
        email: adminInfo.email,
        barnUnitId: farmWithBarns.barns.find((bn) => bn.unit_id === "HN1")
          .unit_id,
        pens: adminInfo.pens,
      });

      await farmService.addLivestockToPen({
        email: adminInfo.email,
        penUnitId: adminInfo.pens.find((pn) => pn.unitId === "PEN1").unitId,
        livestock: adminInfo.livestock,
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
      });

      await farmService.addPensToBarn({
        email: adminInfo.email,
        barnUnitId: farmWithBarns.barns.find((bn) => bn.unit_id === "HN1")
          .unit_id,
        pens: adminInfo.pens,
      });

      await farmService.addLivestockToPen({
        email: adminInfo.email,
        penUnitId: adminInfo.pens.find((pn) => pn.unitId === "PEN1").unitId,
        livestock: adminInfo.livestock,
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
        }),
      ).rejects.toThrow("Livestock not found");
    });
  });

  describe("updateLivestockExpenseRecord", () => {
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
      });

      await farmService.addPensToBarn({
        email: adminInfo.email,
        barnUnitId: farmWithBarns.barns.find((bn) => bn.unit_id === "HN1")
          .unit_id,
        pens: adminInfo.pens,
      });

      await farmService.addLivestockToPen({
        email: adminInfo.email,
        penUnitId: adminInfo.pens.find((pn) => pn.unitId === "PEN1").unitId,
        livestock: adminInfo.livestock,
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
      });

      await farmService.addPensToBarn({
        email: adminInfo.email,
        barnUnitId: farmWithBarns.barns.find((bn) => bn.unit_id === "HN1")
          .unit_id,
        pens: adminInfo.pens,
      });

      await farmService.addLivestockToPen({
        email: adminInfo.email,
        penUnitId: adminInfo.pens.find((pn) => pn.unitId === "PEN1").unitId,
        livestock: adminInfo.livestock,
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
        }),
      ).rejects.toThrow("Livestock not found");
    });
  });

  describe("updateLivestockSalesRecord", () => {
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
      });

      await farmService.addPensToBarn({
        email: adminInfo.email,
        barnUnitId: farmWithBarns.barns.find((bn) => bn.unit_id === "HN1")
          .unit_id,
        pens: adminInfo.pens,
      });

      await farmService.addLivestockToPen({
        email: adminInfo.email,
        penUnitId: adminInfo.pens.find((pn) => pn.unitId === "PEN1").unitId,
        livestock: adminInfo.livestock,
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
        }),
      ).rejects.toThrow("Sales record not found");
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
      });

      expect(farms).toHaveLength(2);

      farms = await farmService.listFarms({
        email: adminInfo.email,
        searchTerm: "Fred Farms 1",
      });

      expect(farms).toHaveLength(1);
      expect(farms[0].name).toBe("Fred Farms 1");

      farms = await farmService.listFarms({
        email: adminInfo.email,
        searchTerm: "Fred Farms 1",
        filter: { id: farms[0].id },
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
      });

      expect(barns).toHaveLength(2);
      expect(barns.map((barn) => barn.unit_id)).toContain("HN1");

      barns = await farmService.listBarns({
        email: adminInfo.email,
        searchTerm: "Fred Barn 1",
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
      });

      expect(pens).toHaveLength(2);
      expect(pens.map((pen) => pen.unit_id)).toContain("PEN1");

      pens = await farmService.listPens({
        email: adminInfo.email,
        searchTerm: "Fred Pen 1",
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
      });

      expect(livestock).toHaveLength(2);
      expect(livestock.map((livestock) => livestock.livestock_tag)).toContain(
        "LST1",
      );

      livestock = await farmService.listLivestock({
        email: adminInfo.email,
        searchTerm: "LST1",
      });

      expect(livestock).toHaveLength(1);
      expect(livestock[0].livestock_tag).toContain("LST1");
    });
  });

  describe("getLivestock", () => {
    it("should return livestock with provided unit id", async () => {
      await setupForQueries();

      const livestock = await farmService.getLivestock({
        email: adminInfo.email,
        livestockTag: adminInfo.livestock[0].livestockTag,
      });

      expect(livestock).toBeDefined();
      expect(livestock.livestock_tag).toContain(
        adminInfo.livestock[0].livestockTag,
      );
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
        roles: [WorkerRole.ANIMAL_CARETAKER],
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
    });

    // add barns to farm
    const farmWithBarns = await farmService.addBarnsToFarm({
      email: adminInfo.email,
      farmTag: farm.farm_tag,
      barns: adminInfo.barns,
    });

    // add pens to farm
    await farmService.addPensToBarn({
      email: adminInfo.email,
      barnUnitId: farmWithBarns.barns.find((bn) => bn.unit_id === "HN1")
        .unit_id,
      pens: adminInfo.pens,
    });

    // add livestock to pen
    await farmService.addLivestockToPen({
      email: adminInfo.email,
      penUnitId: adminInfo.pens.find((pn) => pn.unitId === "PEN1").unitId,
      livestock: adminInfo.livestock,
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
      },
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
    });

    return { admin, farm };
  };
});
