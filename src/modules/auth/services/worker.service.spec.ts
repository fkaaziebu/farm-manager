import { BadRequestException, NotFoundException } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { Connection, Repository } from "typeorm";
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
  Feedback,
  Field,
  Greenhouse,
  Group,
  GrowthRecord,
  HealthRecord,
  Hive,
  Iam,
  LeafDetection,
  Livestock,
  Pen,
  Pond,
  PoultryBatch,
  PoultryHouse,
  Prediction,
  Report,
  Request,
  Review,
  SalesRecord,
  Task,
  Worker,
} from "../../../database/entities";
import { HashHelper } from "../../../helpers";
import { EmailProducer } from "../../../modules/queue/producers/email.producer";
import { QueueModule } from "../../queue/queue.module";
import { WorkerService } from "./worker.service";

describe("WorkerService", () => {
  let module: TestingModule;
  let workerService: WorkerService;
  let connection: Connection;
  let emailProducer: EmailProducer;
  let workerRepository: Repository<Worker>;
  let adminRepository: Repository<Admin>;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        QueueModule,
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
              LeafDetection,
              Iam,
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
          Review,
          SalesRecord,
          Task,
          Worker,
          Prediction,
          Feedback,
          LeafDetection,
          Iam,
        ]),
      ],
      controllers: [],
      providers: [WorkerService],
    }).compile();

    connection = module.get<Connection>(Connection);
    workerService = module.get<WorkerService>(WorkerService);
    emailProducer = module.get<EmailProducer>(EmailProducer);
    workerRepository = module.get<Repository<Worker>>(
      getRepositoryToken(Worker),
    );
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

    jest
      .spyOn(emailProducer, "sendPasswordResetEmail")
      .mockResolvedValue(void 0);
    jest.spyOn(emailProducer, "sendOTPCodeByEmail").mockResolvedValue(void 0);
    jest.spyOn(emailProducer, "sendOTPCodeBySMS").mockResolvedValue(void 0);
  });

  afterAll(async () => {
    await connection.close();
    await module.close();
  });

  describe("loginWorker", () => {
    it("returns worker after successful login", async () => {
      await registerAdmin(adminInfo);
      await registerWorker(adminInfo);

      const response = await workerService.loginWorker({
        email: adminInfo.email,
        password: adminInfo.password,
      });

      expect(response.email).toBe(adminInfo.email);
      expect(response.name).toBe(adminInfo.name);
      expect(response.farms).toBeUndefined();
      expect(response.assigned_tasks).toBeUndefined();
      expect(response.token).not.toBeUndefined();
    });

    it("throws an error if email or password is incorrect", async () => {
      await registerWorker(adminInfo);

      await expect(
        workerService.loginWorker({
          email: adminInfo.email,
          password: "123",
        }),
      ).rejects.toThrow(
        new BadRequestException("Email or password is incorrect"),
      );

      await expect(
        workerService.loginWorker({
          email: "fkaaziebu1998@gmail.com",
          password: adminInfo.password,
        }),
      ).rejects.toThrow(
        new BadRequestException("Email or password is incorrect"),
      );
    });
  });

  describe("requestWorkerPasswordReset", () => {
    it("returns a message of \`Password reset details sent to your email!\` when successful", async () => {
      await registerAdmin(adminInfo);
      await registerWorker(adminInfo);

      const response = await workerService.requestWorkerPasswordReset({
        email: adminInfo.email,
      });

      expect(response.message).toBe(
        "Password reset details sent to your email!",
      );
    });

    it("throws an error if email is incorrect or not found", async () => {
      await expect(
        workerService.requestWorkerPasswordReset({
          email: "fkaaziebu1998@gmail.com",
        }),
      ).rejects.toThrow(new BadRequestException("User not found"));
    });
  });

  describe("resetWorkerPassword", () => {
    const getWorkerByEmail = async (email: string) => {
      return workerRepository.findOne({ where: { email } });
    };
    it("returns a message of \'password reset successful\'", async () => {
      await registerWorker(adminInfo);
      await workerService.requestWorkerPasswordReset({
        email: adminInfo.email,
      });

      const admin = await getWorkerByEmail(adminInfo.email);
      const response = await workerService.resetWorkerPassword({
        email: adminInfo.email,
        password: adminInfo.password,
        resetCode: admin.password_reset_code,
      });

      expect(response.message).toBe("Password reset successful");
    });

    it("throws an error if email is incorrect or user does not exist", async () => {
      await expect(
        workerService.resetWorkerPassword({
          email: adminInfo.email,
          password: adminInfo.password,
          resetCode: "admin.password_reset_code",
        }),
      ).rejects.toThrow(new BadRequestException("User not found"));
    });

    it("throws an error if worker has not requested a reset code", async () => {
      await registerWorker(adminInfo);

      await expect(
        workerService.resetWorkerPassword({
          email: adminInfo.email,
          password: adminInfo.password,
          resetCode: "admin.password_reset_code",
        }),
      ).rejects.toThrow(
        new BadRequestException("User did not request a reset"),
      );
    });

    it("throws an error if worker reset code is incorrect", async () => {
      await registerWorker(adminInfo);
      await workerService.requestWorkerPasswordReset({
        email: adminInfo.email,
      });

      await expect(
        workerService.resetWorkerPassword({
          email: adminInfo.email,
          password: adminInfo.password,
          resetCode: "admin.password_reset_code",
        }),
      ).rejects.toThrow(new BadRequestException("Incorrect resetCode"));
    });
  });

  describe("loginWorkerWithOTP", () => {
    const getWorkerByEmail = async (email: string) => {
      return workerRepository.findOne({ where: { email } });
    };

    it("returns token and other info after successful login", async () => {
      await registerAdmin(adminInfo);
      await registerWorker(adminInfo);
      await workerService.requestWorkerLoginWithOTP({
        email: adminInfo.email,
      });

      const worker = await getWorkerByEmail(adminInfo.email);

      const response = await workerService.loginWorkerWithOTP({
        email: adminInfo.email,
        otpCode: worker.otp_code,
      });

      expect(response.token).not.toBeNull();
      expect(response.otp_code).toBeNull();
      expect(response.otp_request_date).toBeNull();
    });

    it("throws an error if email or otp_code is incorrect", async () => {
      await registerWorker(adminInfo);
      await workerService.requestWorkerLoginWithOTP({
        email: adminInfo.email,
      });

      await expect(
        workerService.loginWorkerWithOTP({
          email: adminInfo.email,
          otpCode: "123",
        }),
      ).rejects.toThrow(
        new BadRequestException("Email or otp code is incorrect"),
      );

      const worker = await getWorkerByEmail(adminInfo.email);

      await expect(
        workerService.loginWorkerWithOTP({
          email: "fkaaziebu1998@gmail.com",
          otpCode: worker.otp_code,
        }),
      ).rejects.toThrow(
        new BadRequestException("Email or otp code is incorrect"),
      );
    });
  });

  describe("requestWorkerOTPLogin", () => {
    const getWorkerByEmail = async (email: string) => {
      return workerRepository.findOne({ where: { email } });
    };

    it("returns success message when otp code sent successfully", async () => {
      await registerAdmin(adminInfo);
      await registerWorker(adminInfo);
      const response = await workerService.requestWorkerLoginWithOTP({
        email: adminInfo.email,
      });

      expect(response.message).toBe(
        "OTP code sent to your email or sms, check to continue!",
      );

      const worker = await getWorkerByEmail(adminInfo.email);

      expect(worker.otp_code).not.toBeNull();
      expect(worker.otp_request_date).not.toBeNull();
    });

    it("throws an error when worker does not exist", async () => {
      await expect(
        workerService.requestWorkerLoginWithOTP({
          email: adminInfo.email,
        }),
      ).rejects.toThrow(new NotFoundException("Worker email does not exist"));
    });
  });

  const registerAdmin = async ({ name, email, password }) => {
    const admin = new Admin();
    admin.email = email;
    admin.name = name;
    admin.password = await HashHelper.encrypt(password);

    return adminRepository.save(admin);
  };

  const registerWorker = async ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) => {
    const admin = await getAdmin(adminInfo.email);

    const worker = new Worker();
    worker.name = name;
    worker.email = email;
    worker.password = await HashHelper.encrypt(password);

    if (admin) {
      admin.workers.push(worker);
      await adminRepository.save(admin);
    }

    return workerRepository.save(worker);
  };

  const getAdmin = async (email: string) => {
    const admin = await adminRepository.findOne({
      where: {
        email,
      },
      relations: ["workers"],
    });

    return admin;
  };

  const adminInfo = {
    name: "Frederick Aziebu",
    email: "frederickaziebu1998@gmail.com",
    password: "Microsoft@2021",
  };
});
