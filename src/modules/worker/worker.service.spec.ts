import { Test, TestingModule } from "@nestjs/testing";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { WorkerService } from "./worker.service";
import { Connection, Repository } from "typeorm";
import { JwtModule } from "@nestjs/jwt";

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
  Report,
} from "../../database/entities";
import { FarmType } from "../../database/types/farm.type";
import { HashHelper } from "../../helpers";
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { WorkerRole } from "../../database/types/worker.type";

describe("WorkerService", () => {
  let module: TestingModule;
  let connection: Connection;
  let farmRepository: Repository<Farm>;
  let workerRepository: Repository<Worker>;
  let workerService: WorkerService;

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
          Report,
        ]),
      ],
      controllers: [],
      providers: [WorkerService],
    }).compile();

    connection = module.get<Connection>(Connection);
    farmRepository = module.get<Repository<Farm>>(getRepositoryToken(Farm));
    workerRepository = module.get<Repository<Worker>>(
      getRepositoryToken(Worker),
    );
    workerService = module.get<WorkerService>(WorkerService);
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
  describe("createReport", () => {
    it("create worker (auditor) report", async () => {
      await createWorkerSetup(workerInfo);

      let worker = await getWorker(workerInfo.email);
      const response = await workerService.createReport({
        email: workerInfo.email,
        farmTag: worker.farms[0].farm_tag,
      });

      expect(response.id).toBeDefined();

      worker = await getWorker(workerInfo.email);

      expect(worker.reports.length).toEqual(1);
      expect(worker.farms[0].reports.length).toEqual(1);
    });

    it("throws an error if worker does not belong to the farm", async () => {
      await expect(
        workerService.createReport({
          email: workerInfo.email,
          farmTag: "fb96af68-8f17-4e59-b50e-6cd94a81d904",
        }),
      ).rejects.toThrow(NotFoundException);

      await expect(
        workerService.createReport({
          email: workerInfo.email,
          farmTag: "fb96af68-8f17-4e59-b50e-6cd94a81d904",
        }),
      ).rejects.toThrow("Worker does not belong to this farm");
    });

    it("throws an error if worker is not an AUDITOR", async () => {
      await createWorkerSetup({
        ...workerInfo,
        role: WorkerRole.ANIMAL_CARETAKER,
      });

      const worker = await getWorker(workerInfo.email);

      await expect(
        workerService.createReport({
          email: workerInfo.email,
          farmTag: worker.farms[0].farm_tag,
        }),
      ).rejects.toThrow(UnauthorizedException);

      await expect(
        workerService.createReport({
          email: workerInfo.email,
          farmTag: worker.farms[0].farm_tag,
        }),
      ).rejects.toThrow("This worker is not an AUDITOR");
    });
  });

  describe("verifyReport", () => {
    it("renders the report verified after worker verifies it", async () => {
      await createWorkerSetup(workerInfo);

      let worker = await getWorker(workerInfo.email);
      const report = await workerService.createReport({
        email: workerInfo.email,
        farmTag: worker.farms[0].farm_tag,
      });

      const response = await workerService.verifyReport({
        email: workerInfo.email,
        reportTag: report.report_tag,
        verificationCode: worker.farms[0].verification_code,
        coordinate: {
          lat: 6.266741524410753,
          lon: 0.04420958275423949,
        },
      });

      expect(response.verified).toBeTruthy();

      worker = await getWorker(workerInfo.email);
      expect(worker.reports[0].verified).toBeTruthy();
    });

    it("throws an error if report not found", async () => {
      await expect(
        workerService.verifyReport({
          email: workerInfo.email,
          reportTag: "fb96af68-8f17-4e59-b50e-6cd94a81d904",
          verificationCode: "fb96af68-8f17-4e59-b50e-6cd94a81d904",
          coordinate: {
            lat: 6.266741524410753,
            lon: 0.04420958275423949,
          },
        }),
      ).rejects.toThrow(NotFoundException);

      await expect(
        workerService.verifyReport({
          email: workerInfo.email,
          reportTag: "fb96af68-8f17-4e59-b50e-6cd94a81d904",
          verificationCode: "fb96af68-8f17-4e59-b50e-6cd94a81d904",
          coordinate: {
            lat: 6.266741524410753,
            lon: 0.04420958275423949,
          },
        }),
      ).rejects.toThrow("Report not found");
    });

    it("throws an error if qrcode is invalid", async () => {
      await createWorkerSetup(workerInfo);

      const worker = await getWorker(workerInfo.email);

      const report = await workerService.createReport({
        email: workerInfo.email,
        farmTag: worker.farms[0].farm_tag,
      });

      await expect(
        workerService.verifyReport({
          email: workerInfo.email,
          reportTag: report.report_tag,
          verificationCode: "fb96af68-8f17-4e59-b50e-6cd94a81d904",
          coordinate: {
            lat: 6.266741524410753,
            lon: 0.04420958275423949,
          },
        }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        workerService.verifyReport({
          email: workerInfo.email,
          reportTag: report.report_tag,
          verificationCode: "fb96af68-8f17-4e59-b50e-6cd94a81d904",
          coordinate: {
            lat: 6.266741524410753,
            lon: 0.04420958275423949,
          },
        }),
      ).rejects.toThrow("QR code is invalid");
    });

    it("throws an error if report has already been verified", async () => {
      await createWorkerSetup(workerInfo);

      const worker = await getWorker(workerInfo.email);
      const report = await workerService.createReport({
        email: workerInfo.email,
        farmTag: worker.farms[0].farm_tag,
      });

      await workerService.verifyReport({
        email: workerInfo.email,
        reportTag: report.report_tag,
        verificationCode: worker.farms[0].verification_code,
        coordinate: {
          lat: 6.266741524410753,
          lon: 0.04420958275423949,
        },
      });

      await expect(
        workerService.verifyReport({
          email: workerInfo.email,
          reportTag: report.report_tag,
          verificationCode: worker.farms[0].verification_code,
          coordinate: {
            lat: 6.266741524410753,
            lon: 0.04420958275423949,
          },
        }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        workerService.verifyReport({
          email: workerInfo.email,
          reportTag: report.report_tag,
          verificationCode: worker.farms[0].verification_code,
          coordinate: {
            lat: 6.266741524410753,
            lon: 0.04420958275423949,
          },
        }),
      ).rejects.toThrow("This report has already been verified");
    });

    it("throws an error if worker is far from farm", async () => {
      await createWorkerSetup(workerInfo);

      const worker = await getWorker(workerInfo.email);
      const report = await workerService.createReport({
        email: workerInfo.email,
        farmTag: worker.farms[0].farm_tag,
      });

      await expect(
        workerService.verifyReport({
          email: workerInfo.email,
          reportTag: report.report_tag,
          verificationCode: worker.farms[0].verification_code,
          coordinate: {
            lat: 0.266741524410753,
            lon: 0.04420958275423949,
          },
        }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        workerService.verifyReport({
          email: workerInfo.email,
          reportTag: report.report_tag,
          verificationCode: worker.farms[0].verification_code,
          coordinate: {
            lat: 0.266741524410753,
            lon: 0.04420958275423949,
          },
        }),
      ).rejects.toThrow("You are not close to the farm");
    });
  });

  describe("updateReport", () => {});

  describe("completeReport", () => {
    it("returns completed report after AUDITOR completes it", async () => {
      await createWorkerSetup(workerInfo);

      let worker = await getWorker(workerInfo.email);
      const report = await workerService.createReport({
        email: workerInfo.email,
        farmTag: worker.farms[0].farm_tag,
      });

      await workerService.verifyReport({
        email: workerInfo.email,
        reportTag: report.report_tag,
        verificationCode: worker.farms[0].verification_code,
        coordinate: {
          lat: 6.266741524410753,
          lon: 0.04420958275423949,
        },
      });

      const response = await workerService.completeReport({
        email: workerInfo.email,
        reportTag: report.report_tag,
      });

      expect(response.completed).toBeTruthy();

      worker = await getWorker(workerInfo.email);

      expect(worker.reports[0].completed).toBeTruthy();
    });

    it("throws an error if the report is not verified", async () => {
      await createWorkerSetup(workerInfo);

      const worker = await getWorker(workerInfo.email);
      const report = await workerService.createReport({
        email: workerInfo.email,
        farmTag: worker.farms[0].farm_tag,
      });

      await expect(
        workerService.completeReport({
          email: workerInfo.email,
          reportTag: report.report_tag,
        }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        workerService.completeReport({
          email: workerInfo.email,
          reportTag: report.report_tag,
        }),
      ).rejects.toThrow(
        "This report is not verified, please verify and update before completing",
      );
    });

    it("throws an error if the report is not found", async () => {
      await expect(
        workerService.completeReport({
          email: workerInfo.email,
          reportTag: "fb96af68-8f17-4e59-b50e-6cd94a81d904",
        }),
      ).rejects.toThrow(NotFoundException);

      await expect(
        workerService.completeReport({
          email: workerInfo.email,
          reportTag: "fb96af68-8f17-4e59-b50e-6cd94a81d904",
        }),
      ).rejects.toThrow("Report not found");
    });
  });

  // Queries
  describe("listReport", () => {});

  describe("getReport", () => {});

  describe("getQrCode", () => {});

  const workerInfo = {
    email: "frederickaziebu1998@gmail.com",
    name: "Frederick Aziebu",
    password: "password",
    role: WorkerRole.AUDITOR,
  };

  const createWorkerSetup = async ({
    email,
    name,
    password,
    role,
  }: {
    name: string;
    email: string;
    password: string;
    role: WorkerRole;
  }) => {
    const worker = new Worker();
    worker.name = name;
    worker.email = email;
    worker.roles = [role];
    worker.password = await HashHelper.encrypt(password);

    const saved_worker = await workerRepository.save(worker);

    const farm = new Farm();
    farm.name = "Fred Farms";
    farm.area = "20 acres";
    farm.location = "Kpong";
    farm.latitude = 6.266761524410753;
    farm.longitude = 0.04420558275423949;
    farm.farm_type = FarmType.LIVESTOCK;
    farm.workers = [saved_worker];

    await farmRepository.save(farm);

    return saved_worker;
  };

  const getWorker = async (email) => {
    const worker = await workerRepository.findOne({
      where: {
        email,
      },
      relations: ["reports", "farms.reports"],
    });

    return worker;
  };
});
