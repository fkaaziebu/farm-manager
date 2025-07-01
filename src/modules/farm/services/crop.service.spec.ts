import { Test, TestingModule } from "@nestjs/testing";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { CropService } from "./crop.service";
import { Connection, Repository } from "typeorm";
import { JwtModule } from "@nestjs/jwt";
import { HashHelper } from "../../../helpers";

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
} from "../../../database/entities";
import { FarmType } from "../../../database/types/farm.type";
import { WorkerRole } from "../../../database/types/worker.type";
import { CropType } from "../../../database/types/crop-batch.type";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { ExpenseCategory } from "../../../database/types/expense-record.type";

describe("CropService", () => {
  let module: TestingModule;
  let connection: Connection;
  let adminRepository: Repository<Admin>;
  let farmRepository: Repository<Farm>;
  let workerRepository: Repository<Worker>;
  let cropService: CropService;

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
        ]),
      ],
      controllers: [],
      providers: [CropService],
    }).compile();

    connection = module.get<Connection>(Connection);
    adminRepository = module.get<Repository<Admin>>(getRepositoryToken(Admin));
    farmRepository = module.get<Repository<Farm>>(getRepositoryToken(Farm));
    workerRepository = module.get<Repository<Worker>>(
      getRepositoryToken(Worker),
    );
    cropService = module.get<CropService>(CropService);
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
  describe("addFieldsToFarm", () => {
    it("returns farm with fields when fields added successfully", async () => {
      await setupForQueries();

      const admin = await getAdmin(adminInfo.email);

      let response = await cropService.addFieldsToFarm({
        email: adminInfo.email,
        farmTag: admin.farms[0].farm_tag,
        fields: [adminInfo.fields[0]],
        role: "ADMIN",
      });

      expect(response.fields.length).toEqual(1);

      response = await cropService.addFieldsToFarm({
        email: adminInfo.workers[1].email,
        farmTag: admin.farms[0].farm_tag,
        fields: [adminInfo.fields[1]],
        role: "WORKER",
      });

      expect(response.fields.length).toEqual(2);
    });
  });

  describe("addGreenhousesToFarm", () => {
    it("returns farm with greenhouses when greenhouses added successfully", async () => {
      await setupForQueries();

      const admin = await getAdmin(adminInfo.email);

      let response = await cropService.addGreenhousesToFarm({
        email: adminInfo.email,
        farmTag: admin.farms[0].farm_tag,
        greenhouses: [adminInfo.greenhouses[0]],
        role: "ADMIN",
      });

      expect(response.greenhouses.length).toEqual(1);

      response = await cropService.addGreenhousesToFarm({
        email: adminInfo.workers[1].email,
        farmTag: admin.farms[0].farm_tag,
        greenhouses: [adminInfo.greenhouses[1]],
        role: "WORKER",
      });

      expect(response.greenhouses.length).toEqual(2);
    });
  });

  describe("addCropBatchToField", () => {
    it("returns field with crop_batch when added successfully", async () => {
      await setupForQueries();

      let admin = await getAdmin(adminInfo.email);

      const field = (
        await cropService.addFieldsToFarm({
          email: adminInfo.email,
          farmTag: admin.farms[0].farm_tag,
          fields: [adminInfo.fields[0]],
          role: "ADMIN",
        })
      ).fields[0];

      let response = await cropService.addCropBatchesToField({
        email: adminInfo.email,
        fieldUnitId: field.unit_id,
        cropBatches: [adminInfo.cropBatches[0]],
        role: "ADMIN",
      });

      expect(response.crop_batches.length).toEqual(1);

      response = await cropService.addCropBatchesToField({
        email: adminInfo.workers[0].email,
        fieldUnitId: field.unit_id,
        cropBatches: [adminInfo.cropBatches[1]],
        role: "WORKER",
      });

      expect(response.crop_batches.length).toEqual(2);
    });

    it("throws an error if crop_batch already exist", async () => {
      await setupForQueries();

      let admin = await getAdmin(adminInfo.email);

      const field = (
        await cropService.addFieldsToFarm({
          email: adminInfo.email,
          farmTag: admin.farms[0].farm_tag,
          fields: [adminInfo.fields[0]],
          role: "ADMIN",
        })
      ).fields[0];

      await cropService.addCropBatchesToField({
        email: adminInfo.email,
        fieldUnitId: field.unit_id,
        cropBatches: [adminInfo.cropBatches[0]],
        role: "ADMIN",
      });

      await expect(
        cropService.addCropBatchesToField({
          email: adminInfo.email,
          fieldUnitId: field.unit_id,
          cropBatches: [adminInfo.cropBatches[0]],
          role: "ADMIN",
        }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        cropService.addCropBatchesToField({
          email: adminInfo.email,
          fieldUnitId: field.unit_id,
          cropBatches: [adminInfo.cropBatches[0]],
          role: "ADMIN",
        }),
      ).rejects.toThrow(
        `A crop batch with crop batch tag ${adminInfo.cropBatches[0].cropBatchTag} already exist`,
      );
    });

    it("throws an error if field does not exist", async () => {
      await setupForQueries();

      await expect(
        cropService.addCropBatchesToField({
          email: adminInfo.email,
          fieldUnitId: adminInfo.fields[0].unitId,
          cropBatches: [adminInfo.cropBatches[0]],
          role: "ADMIN",
        }),
      ).rejects.toThrow(NotFoundException);

      await expect(
        cropService.addCropBatchesToField({
          email: adminInfo.email,
          fieldUnitId: adminInfo.fields[0].unitId,
          cropBatches: [adminInfo.cropBatches[0]],
          role: "ADMIN",
        }),
      ).rejects.toThrow("Field not found");
    });
  });

  describe("addCropBatchToGreenhouse", () => {
    it("returns greenhouse with crop_batch when added successfully", async () => {
      await setupForQueries();

      let admin = await getAdmin(adminInfo.email);

      const greenhouse = (
        await cropService.addGreenhousesToFarm({
          email: adminInfo.email,
          farmTag: admin.farms[0].farm_tag,
          greenhouses: [adminInfo.greenhouses[0]],
          role: "ADMIN",
        })
      ).greenhouses[0];

      let response = await cropService.addCropBatchesToGreenhouse({
        email: adminInfo.email,
        greenhouseUnitId: greenhouse.unit_id,
        cropBatches: [adminInfo.cropBatches[0]],
        role: "ADMIN",
      });

      expect(response.crop_batches.length).toEqual(1);

      response = await cropService.addCropBatchesToGreenhouse({
        email: adminInfo.workers[0].email,
        greenhouseUnitId: greenhouse.unit_id,
        cropBatches: [adminInfo.cropBatches[1]],
        role: "WORKER",
      });

      expect(response.crop_batches.length).toEqual(2);
    });

    it("throws an error if crop_batch already exist", async () => {
      await setupForQueries();

      let admin = await getAdmin(adminInfo.email);

      const greenhouse = (
        await cropService.addGreenhousesToFarm({
          email: adminInfo.email,
          farmTag: admin.farms[0].farm_tag,
          greenhouses: [adminInfo.greenhouses[0]],
          role: "ADMIN",
        })
      ).greenhouses[0];

      await cropService.addCropBatchesToGreenhouse({
        email: adminInfo.email,
        greenhouseUnitId: greenhouse.unit_id,
        cropBatches: [adminInfo.cropBatches[0]],
        role: "ADMIN",
      });

      await expect(
        cropService.addCropBatchesToGreenhouse({
          email: adminInfo.email,
          greenhouseUnitId: greenhouse.unit_id,
          cropBatches: [adminInfo.cropBatches[0]],
          role: "ADMIN",
        }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        cropService.addCropBatchesToGreenhouse({
          email: adminInfo.email,
          greenhouseUnitId: greenhouse.unit_id,
          cropBatches: [adminInfo.cropBatches[0]],
          role: "ADMIN",
        }),
      ).rejects.toThrow(
        `A crop batch with crop batch tag ${adminInfo.cropBatches[0].cropBatchTag} already exist`,
      );
    });

    it("throws an error if greenhouse does not exist", async () => {
      await setupForQueries();

      await expect(
        cropService.addCropBatchesToGreenhouse({
          email: adminInfo.email,
          greenhouseUnitId: adminInfo.greenhouses[0].unitId,
          cropBatches: [adminInfo.cropBatches[0]],
          role: "ADMIN",
        }),
      ).rejects.toThrow(NotFoundException);

      await expect(
        cropService.addCropBatchesToGreenhouse({
          email: adminInfo.email,
          greenhouseUnitId: adminInfo.greenhouses[0].unitId,
          cropBatches: [adminInfo.cropBatches[0]],
          role: "ADMIN",
        }),
      ).rejects.toThrow("Greenhouse not found");
    });
  });

  describe("addCropBatchExpenseRecord", () => {
    it("returns the created expense record when successful", async () => {
      await setupForQueries();

      let admin = await getAdmin(adminInfo.email);

      const field = (
        await cropService.addFieldsToFarm({
          email: adminInfo.email,
          farmTag: admin.farms[0].farm_tag,
          fields: [adminInfo.fields[0]],
          role: "ADMIN",
        })
      ).fields[0];

      await cropService.addCropBatchesToField({
        email: adminInfo.email,
        fieldUnitId: field.unit_id,
        cropBatches: [adminInfo.cropBatches[0]],
        role: "ADMIN",
      });

      const response = await cropService.addCropBatchExpenseRecord({
        email: adminInfo.email,
        cropBatchTag: adminInfo.cropBatches[0].cropBatchTag,
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

    it("throws an error if crop batch does not exist", async () => {
      await expect(
        cropService.addCropBatchExpenseRecord({
          email: adminInfo.email,
          cropBatchTag: adminInfo.cropBatches[0].cropBatchTag,
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
        cropService.addCropBatchExpenseRecord({
          email: adminInfo.email,
          cropBatchTag: adminInfo.cropBatches[0].cropBatchTag,
          expenseRecord: {
            amount: 100,
            expenseDate: new Date(),
            category: ExpenseCategory.FEED,
            notes: "Initial expense record",
          },
          role: "ADMIN",
        }),
      ).rejects.toThrow("Crop batch not found");
    });
  });

  describe("addCropBatchSalesRecord", () => {
    it("returns the created sales record when successful", async () => {
      await setupForQueries();

      let admin = await getAdmin(adminInfo.email);

      const field = (
        await cropService.addFieldsToFarm({
          email: adminInfo.email,
          farmTag: admin.farms[0].farm_tag,
          fields: [adminInfo.fields[0]],
          role: "ADMIN",
        })
      ).fields[0];

      await cropService.addCropBatchesToField({
        email: adminInfo.email,
        fieldUnitId: field.unit_id,
        cropBatches: [adminInfo.cropBatches[0]],
        role: "ADMIN",
      });

      const response = await cropService.addCropBatchSalesRecord({
        email: adminInfo.email,
        cropBatchTag: adminInfo.cropBatches[0].cropBatchTag,
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

    it("throws an error if crop batch does not exist", async () => {
      await expect(
        cropService.addCropBatchSalesRecord({
          email: adminInfo.email,
          cropBatchTag: adminInfo.cropBatches[0].cropBatchTag,
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
        cropService.addCropBatchSalesRecord({
          email: adminInfo.email,
          cropBatchTag: adminInfo.cropBatches[0].cropBatchTag,
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
      ).rejects.toThrow("Crop batch not found");
    });
  });

  describe("updateField", () => {
    it("returns field when update succeeded", async () => {
      await setupForQueries();

      let admin = await getAdmin(adminInfo.email);

      const farm = await cropService.addFieldsToFarm({
        email: adminInfo.email,
        farmTag: admin.farms[0].farm_tag,
        fields: [adminInfo.fields[0]],
        role: "ADMIN",
      });

      const response = await cropService.updateField({
        email: adminInfo.email,
        fieldUnitId: farm.fields[0].unit_id,
        field: {
          ...adminInfo.fields.find(
            (bn) => bn.unitId === farm.fields[0].unit_id,
          ),
          name: "Fred Field updated",
        },
        role: "ADMIN",
      });

      expect(response.name).toBe("Fred Field updated");
    });

    it("throws an error if field to update does not exist", async () => {
      await expect(
        cropService.updateField({
          email: adminInfo.email,
          fieldUnitId: "FN1",
          field: {
            ...adminInfo.fields.find((field) => field.unitId === "FN1"),
            name: "Fred Field updated",
          },
          role: "ADMIN",
        }),
      ).rejects.toThrow(NotFoundException);

      await expect(
        cropService.updateField({
          email: adminInfo.email,
          fieldUnitId: "FN1",
          field: {
            ...adminInfo.fields.find((field) => field.unitId === "FN1"),
            name: "Fred Field updated",
          },
          role: "ADMIN",
        }),
      ).rejects.toThrow("Field not found");
    });
  });

  describe("updateGreenhouse", () => {
    it("returns field when update succeeded", async () => {
      await setupForQueries();

      let admin = await getAdmin(adminInfo.email);

      const farm = await cropService.addGreenhousesToFarm({
        email: adminInfo.email,
        farmTag: admin.farms[0].farm_tag,
        greenhouses: [adminInfo.greenhouses[0]],
        role: "ADMIN",
      });

      const response = await cropService.updateGreenhouse({
        email: adminInfo.email,
        greenhouseUnitId: farm.greenhouses[0].unit_id,
        greenhouse: {
          ...adminInfo.greenhouses.find(
            (gh) => gh.unitId === farm.greenhouses[0].unit_id,
          ),
          name: "Fred Greenhouse updated",
        },
        role: "ADMIN",
      });

      expect(response.name).toBe("Fred Greenhouse updated");
    });

    it("throws an error if field to update does not exist", async () => {
      await expect(
        cropService.updateGreenhouse({
          email: adminInfo.email,
          greenhouseUnitId: "GN1",
          greenhouse: {
            ...adminInfo.greenhouses.find(
              (greenhouse) => greenhouse.unitId === "GN1",
            ),
            name: "Fred Greenhouse updated",
          },
          role: "ADMIN",
        }),
      ).rejects.toThrow(NotFoundException);

      await expect(
        cropService.updateGreenhouse({
          email: adminInfo.email,
          greenhouseUnitId: "GN1",
          greenhouse: {
            ...adminInfo.greenhouses.find(
              (greenhouse) => greenhouse.unitId === "GN1",
            ),
            name: "Fred Greenhouse updated",
          },
          role: "ADMIN",
        }),
      ).rejects.toThrow("Greenhouse not found");
    });
  });

  describe("updateCropBatch", () => {
    it("returns updated crop batch when successful", async () => {
      await setupForQueries();

      let admin = await getAdmin(adminInfo.email);

      const field = (
        await cropService.addFieldsToFarm({
          email: adminInfo.email,
          farmTag: admin.farms[0].farm_tag,
          fields: [adminInfo.fields[0]],
          role: "ADMIN",
        })
      ).fields[0];

      await cropService.addCropBatchesToField({
        email: adminInfo.email,
        fieldUnitId: field.unit_id,
        cropBatches: [adminInfo.cropBatches[0]],
        role: "ADMIN",
      });

      const response = await cropService.updateCropBatch({
        email: adminInfo.email,
        cropBatchTag: adminInfo.cropBatches[0].cropBatchTag,
        cropBatch: {
          name: "Fred Greenhouse 1 updated",
        },
        role: "ADMIN",
      });

      expect(response.name).toBe("Fred Greenhouse 1 updated");
    });

    it("throws an error when crop batch is not found", async () => {
      await expect(
        cropService.updateCropBatch({
          email: adminInfo.email,
          cropBatchTag: adminInfo.cropBatches[0].cropBatchTag,
          cropBatch: {
            name: "Fred Greenhouse 1 updated",
          },
          role: "ADMIN",
        }),
      ).rejects.toThrow(NotFoundException);

      await expect(
        cropService.updateCropBatch({
          email: adminInfo.email,
          cropBatchTag: adminInfo.cropBatches[0].cropBatchTag,
          cropBatch: {
            name: "Fred Greenhouse 1 updated",
          },
          role: "ADMIN",
        }),
      ).rejects.toThrow("Crop batch not found");
    });
  });

  describe("updateCropBatchExpenseRecord", () => {
    it("returns the updated expense record when successful", async () => {
      await setupForQueries();

      let admin = await getAdmin(adminInfo.email);

      const field = (
        await cropService.addFieldsToFarm({
          email: adminInfo.email,
          farmTag: admin.farms[0].farm_tag,
          fields: [adminInfo.fields[0]],
          role: "ADMIN",
        })
      ).fields[0];

      await cropService.addCropBatchesToField({
        email: adminInfo.email,
        fieldUnitId: field.unit_id,
        cropBatches: [adminInfo.cropBatches[0]],
        role: "ADMIN",
      });

      const record = await cropService.addCropBatchExpenseRecord({
        email: adminInfo.email,
        cropBatchTag: adminInfo.cropBatches[0].cropBatchTag,
        expenseRecord: {
          amount: 100,
          expenseDate: new Date(),
          category: ExpenseCategory.FEED,
          notes: "Initial expense record",
        },
        role: "ADMIN",
      });

      const response = await cropService.updateCropBatchExpenseRecord({
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

    it("throws an error if crop batch does not exist", async () => {
      await expect(
        cropService.updateCropBatchExpenseRecord({
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
        cropService.updateCropBatchExpenseRecord({
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

  describe("updateCropBatchSalesRecord", () => {
    it("returns the updated sales record when successful", async () => {
      await setupForQueries();

      let admin = await getAdmin(adminInfo.email);

      const field = (
        await cropService.addFieldsToFarm({
          email: adminInfo.email,
          farmTag: admin.farms[0].farm_tag,
          fields: [adminInfo.fields[0]],
          role: "ADMIN",
        })
      ).fields[0];

      await cropService.addCropBatchesToField({
        email: adminInfo.email,
        fieldUnitId: field.unit_id,
        cropBatches: [adminInfo.cropBatches[0]],
        role: "ADMIN",
      });

      const record = await cropService.addCropBatchSalesRecord({
        email: adminInfo.email,
        cropBatchTag: adminInfo.cropBatches[0].cropBatchTag,
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

      const response = await cropService.updateCropBatchSalesRecord({
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

    it("throws an error if crop batch does not exist", async () => {
      await expect(
        cropService.updateCropBatchSalesRecord({
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
        cropService.updateCropBatchSalesRecord({
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

  // Queries
  describe("getField", () => {
    it("should return field with provided unit id", async () => {
      await setupForQueries();

      let admin = await getAdmin(adminInfo.email);

      await cropService.addFieldsToFarm({
        email: adminInfo.email,
        farmTag: admin.farms[0].farm_tag,
        fields: [adminInfo.fields[0]],
        role: "ADMIN",
      });

      const barn = await cropService.getField({
        email: adminInfo.email,
        fieldUnitId: adminInfo.fields[0].unitId,
        role: "ADMIN",
      });

      expect(barn).toBeDefined();
      expect(barn.name).toContain("Fred Field 1");
    });
  });

  describe("getGreenhouse", () => {
    it("should return greenhouse with provided unit id", async () => {
      await setupForQueries();

      let admin = await getAdmin(adminInfo.email);

      await cropService.addGreenhousesToFarm({
        email: adminInfo.email,
        farmTag: admin.farms[0].farm_tag,
        greenhouses: [adminInfo.greenhouses[0]],
        role: "ADMIN",
      });

      const barn = await cropService.getGreenhouse({
        email: adminInfo.email,
        greenhouseUnitId: adminInfo.greenhouses[0].unitId,
        role: "ADMIN",
      });

      expect(barn).toBeDefined();
      expect(barn.name).toContain("Fred Greenhouse 1");
    });
  });

  describe("getCropBatch", () => {
    it("should return crop batch with provided unit id", async () => {
      await setupForQueries();

      let admin = await getAdmin(adminInfo.email);

      const field = (
        await cropService.addFieldsToFarm({
          email: adminInfo.email,
          farmTag: admin.farms[0].farm_tag,
          fields: [adminInfo.fields[0]],
          role: "ADMIN",
        })
      ).fields[0];

      await cropService.addCropBatchesToField({
        email: adminInfo.email,
        fieldUnitId: field.unit_id,
        cropBatches: [adminInfo.cropBatches[0]],
        role: "ADMIN",
      });

      const cropBatch = await cropService.getCropBatch({
        email: adminInfo.email,
        cropBatchTag: adminInfo.cropBatches[0].cropBatchTag,
        housingUnit: "FIELD",
        role: "ADMIN",
      });

      expect(cropBatch).toBeDefined();
      expect(cropBatch.crop_batch_tag).toContain(
        adminInfo.cropBatches[0].cropBatchTag,
      );
    });
  });

  describe("listFields", () => {
    it("should return a list of fields", async () => {
      await setupForQueries();

      let admin = await getAdmin(adminInfo.email);

      await cropService.addFieldsToFarm({
        email: adminInfo.email,
        farmTag: admin.farms[0].farm_tag,
        fields: [...adminInfo.fields],
        role: "ADMIN",
      });

      let field = await cropService.listFields({
        email: adminInfo.email,
        searchTerm: "",
        role: "ADMIN",
      });

      expect(field).toHaveLength(2);
      expect(field.map((field) => field.unit_id)).toContain("FN1");

      field = await cropService.listFields({
        email: adminInfo.email,
        searchTerm: "Fred Field 1",
        role: "ADMIN",
      });

      expect(field).toHaveLength(1);
      expect(field[0].name).toContain("Fred Field 1");
    });
  });

  describe("listGreenhouses", () => {
    it("should return a list of greenhouses", async () => {
      await setupForQueries();

      let admin = await getAdmin(adminInfo.email);

      await cropService.addGreenhousesToFarm({
        email: adminInfo.email,
        farmTag: admin.farms[0].farm_tag,
        greenhouses: [...adminInfo.greenhouses],
        role: "ADMIN",
      });

      let field = await cropService.listGreenhouses({
        email: adminInfo.email,
        searchTerm: "",
        role: "ADMIN",
      });

      expect(field).toHaveLength(2);
      expect(field.map((field) => field.unit_id)).toContain("GN1");

      field = await cropService.listGreenhouses({
        email: adminInfo.email,
        searchTerm: "Fred Greenhouse 1",
        role: "ADMIN",
      });

      expect(field).toHaveLength(1);
      expect(field[0].name).toContain("Fred Greenhouse 1");
    });
  });

  describe("listCropBatches", () => {
    it("should return a list of crop batches", async () => {
      await setupForQueries();

      let admin = await getAdmin(adminInfo.email);

      const field = (
        await cropService.addFieldsToFarm({
          email: adminInfo.email,
          farmTag: admin.farms[0].farm_tag,
          fields: [adminInfo.fields[0]],
          role: "ADMIN",
        })
      ).fields[0];

      await cropService.addCropBatchesToField({
        email: adminInfo.email,
        fieldUnitId: field.unit_id,
        cropBatches: [...adminInfo.cropBatches],
        role: "ADMIN",
      });

      let cropBatches = await cropService.listCropBatches({
        email: adminInfo.email,
        searchTerm: "",
        housingUnit: "FIELD",
        role: "ADMIN",
      });

      expect(cropBatches).toHaveLength(2);
      expect(
        cropBatches.map((cropBatch) => cropBatch.crop_batch_tag),
      ).toContain("CB1");

      cropBatches = await cropService.listCropBatches({
        email: adminInfo.email,
        searchTerm: "Fred Crop Batch 1",
        housingUnit: "FIELD",
        role: "ADMIN",
      });

      expect(cropBatches).toHaveLength(1);
      expect(cropBatches[0].name).toContain("Fred Crop Batch 1");
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
    fields: [
      {
        areaHectares: 200,
        capacity: 20,
        name: "Fred Field 1",
        unitId: "FN1",
      },
      {
        areaHectares: 200,
        capacity: 20,
        name: "Fred Field 2",
        unitId: "FN2",
      },
    ],
    greenhouses: [
      {
        areaSqm: 200,
        capacity: 20,
        name: "Fred Greenhouse 1",
        unitId: "GN1",
      },
      {
        areaSqm: 200,
        capacity: 20,
        name: "Fred Greenhouse 2",
        unitId: "GN2",
      },
    ],
    cropBatches: [
      {
        cropBatchTag: "CB1",
        name: "Fred Crop Batch 1",
        cropType: CropType.VEGETABLE,
        variety: "long",
        plantingDate: new Date(),
        plantsCount: 23,
        gpsCoordinates: [
          { lat: 1, lon: 2 },
          { lat: 1, lon: 2 },
          { lat: 1, lon: 2 },
          { lat: 1, lon: 2 },
        ],
      },
      {
        cropBatchTag: "CB2",
        name: "Fred Crop Batch 2",
        cropType: CropType.VEGETABLE,
        variety: "long",
        plantingDate: new Date(),
        plantsCount: 23,
        gpsCoordinates: [
          { lat: 1, lon: 2 },
          { lat: 1, lon: 2 },
          { lat: 1, lon: 2 },
          { lat: 1, lon: 2 },
        ],
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
        "farms.fields",
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

    // Create workers
    const workers = await Promise.all(
      adminInfo.workers.map(async (worker) => {
        const new_worker = new Worker();
        new_worker.name = worker.name;
        new_worker.email = worker.email;
        new_worker.roles = worker.roles;
        new_worker.password = await HashHelper.encrypt("1234");

        return new_worker;
      }),
    );

    await workerRepository.save(workers);
    // create farmers and add workers to farm
    const farm = new Farm();
    farm.name = farmInfo.name;
    farm.workers = workers;
    await farmRepository.save(farm);

    if (!admin.farms) {
      admin.farms = [];
    }

    admin.farms.push(farm);
    await adminRepository.save(admin);

    return { admin, farm };
  };
});
