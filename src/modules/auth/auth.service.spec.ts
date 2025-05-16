import { Test, TestingModule } from "@nestjs/testing";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { AuthService } from "./auth.service";
import { Connection, Repository } from "typeorm";
import { JwtModule } from "@nestjs/jwt";
import { BadRequestException } from "@nestjs/common";
import { HashHelper } from "../../helpers";
import { EmailProducer } from "../queue/producers/email.producer";
import { QueueModule } from "../queue/queue.module";

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
  Report,
  Review,
  SalesRecord,
  Task,
  Worker,
} from "../../database/entities";

describe("AuthService", () => {
  let authService: AuthService;
  let module: TestingModule;
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
          Report,
          Review,
          SalesRecord,
          Task,
          Worker,
        ]),
      ],
      controllers: [],
      providers: [AuthService],
    }).compile();

    connection = module.get<Connection>(Connection);
    authService = module.get<AuthService>(AuthService);
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
  });

  afterAll(async () => {
    await connection.close();
    await module.close();
  });

  describe("registerAdmin", () => {
    it("returns admin after successful registration", async () => {
      const response = await authService.registerAdmin(adminInfo);

      expect(response.email).toBe(adminInfo.email);
      expect(response.name).toBe(adminInfo.name);
      expect(response.farms).toBeUndefined();
      expect(response.assigned_tasks).toBeUndefined();
      expect(response.workers).toBeUndefined();
    });

    it("throws an error if admin already exist", async () => {
      await authService.registerAdmin(adminInfo);

      await expect(authService.registerAdmin(adminInfo)).rejects.toThrow(
        BadRequestException,
      );

      await expect(authService.registerAdmin(adminInfo)).rejects.toThrow(
        "Email already exist",
      );
    });
  });

  describe("loginAdmin", () => {
    it("returns admin with token after successful login", async () => {
      await authService.registerAdmin(adminInfo);

      const response = await authService.loginAdmin({
        email: adminInfo.email,
        password: adminInfo.password,
      });

      expect(response.email).toBe(adminInfo.email);
      expect(response.name).toBe(adminInfo.name);
      expect(response.farms).toBeUndefined();
      expect(response.assigned_tasks).toBeUndefined();
      expect(response.workers).toBeUndefined();
      expect(response.token).not.toBeUndefined();
    });

    it("throws an error if email or password is incorrect", async () => {
      await authService.registerAdmin(adminInfo);

      await expect(
        authService.loginAdmin({
          email: adminInfo.email,
          password: "123",
        }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        authService.loginAdmin({
          email: adminInfo.email,
          password: "123",
        }),
      ).rejects.toThrow("Email or password is incorrect");

      await expect(
        authService.loginAdmin({
          email: "fkaaziebu1998@gmail.com",
          password: adminInfo.password,
        }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        authService.loginAdmin({
          email: "fkaaziebu1998@gmail.com",
          password: adminInfo.password,
        }),
      ).rejects.toThrow("Email or password is incorrect");
    });
  });

  describe("loginWorker", () => {
    it("returns worker after successful login", async () => {
      await registerAdmin(adminInfo);
      await registerWorker(adminInfo);

      const response = await authService.loginWorker({
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
        authService.loginWorker({
          email: adminInfo.email,
          password: "123",
        }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        authService.loginWorker({
          email: adminInfo.email,
          password: "123",
        }),
      ).rejects.toThrow("Email or password is incorrect");

      await expect(
        authService.loginWorker({
          email: "fkaaziebu1998@gmail.com",
          password: adminInfo.password,
        }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        authService.loginWorker({
          email: "fkaaziebu1998@gmail.com",
          password: adminInfo.password,
        }),
      ).rejects.toThrow("Email or password is incorrect");
    });
  });

  describe("requestAdminPasswordReset", () => {
    it("returns a message of \`Password reset details sent to your email!\` when successful", async () => {
      await authService.registerAdmin(adminInfo);

      const response = await authService.requestAdminPasswordReset({
        email: adminInfo.email,
      });

      expect(response.message).toBe(
        "Password reset details sent to your email!",
      );
    });

    it("throws an error if email is incorrect or not found", async () => {
      await expect(
        authService.requestAdminPasswordReset({
          email: "fkaaziebu1998@gmail.com",
        }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        authService.requestAdminPasswordReset({
          email: "fkaaziebu1998@gmail.com",
        }),
      ).rejects.toThrow("User not found");
    });
  });

  describe("requestWorkerPasswordReset", () => {
    it("returns a message of \`Password reset details sent to your email!\` when successful", async () => {
      await registerWorker(adminInfo);

      const response = await authService.requestWorkerPasswordReset({
        email: adminInfo.email,
      });

      expect(response.message).toBe(
        "Password reset details sent to your email!",
      );
    });

    it("throws an error if email is incorrect or not found", async () => {
      await expect(
        authService.requestWorkerPasswordReset({
          email: "fkaaziebu1998@gmail.com",
        }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        authService.requestWorkerPasswordReset({
          email: "fkaaziebu1998@gmail.com",
        }),
      ).rejects.toThrow("User not found");
    });
  });

  describe("resetAdminPassword", () => {
    const getAdminByEmail = async (email: string) => {
      return adminRepository.findOne({ where: { email } });
    };
    it("returns a message of \'password reset successful\'", async () => {
      await authService.registerAdmin(adminInfo);
      await authService.requestAdminPasswordReset({
        email: adminInfo.email,
      });

      const admin = await getAdminByEmail(adminInfo.email);
      const response = await authService.resetAdminPassword({
        email: adminInfo.email,
        password: adminInfo.password,
        resetCode: admin.password_reset_code,
      });

      expect(response.message).toBe("Password reset successful");
    });

    it("throws an error if email is incorrect or user does not exist", async () => {
      await expect(
        authService.resetAdminPassword({
          email: adminInfo.email,
          password: adminInfo.password,
          resetCode: "admin.password_reset_code",
        }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        authService.resetAdminPassword({
          email: adminInfo.email,
          password: adminInfo.password,
          resetCode: "admin.password_reset_code",
        }),
      ).rejects.toThrow("User not found");
    });

    it("throws an error if admin has not requested a reset code", async () => {
      await authService.registerAdmin(adminInfo);

      await expect(
        authService.resetAdminPassword({
          email: adminInfo.email,
          password: adminInfo.password,
          resetCode: "admin.password_reset_code",
        }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        authService.resetAdminPassword({
          email: adminInfo.email,
          password: adminInfo.password,
          resetCode: "admin.password_reset_code",
        }),
      ).rejects.toThrow("User did not request a reset");
    });

    it("throws an error if admin reset code is incorrect", async () => {
      await authService.registerAdmin(adminInfo);
      await authService.requestAdminPasswordReset({
        email: adminInfo.email,
      });

      await expect(
        authService.resetAdminPassword({
          email: adminInfo.email,
          password: adminInfo.password,
          resetCode: "admin.password_reset_code",
        }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        authService.resetAdminPassword({
          email: adminInfo.email,
          password: adminInfo.password,
          resetCode: "admin.password_reset_code",
        }),
      ).rejects.toThrow("Incorrect resetCode");
    });
  });

  describe("resetWorkerPassword", () => {
    const getWorkerByEmail = async (email: string) => {
      return workerRepository.findOne({ where: { email } });
    };
    it("returns a message of \'password reset successful\'", async () => {
      await registerWorker(adminInfo);
      await authService.requestWorkerPasswordReset({
        email: adminInfo.email,
      });

      const admin = await getWorkerByEmail(adminInfo.email);
      const response = await authService.resetWorkerPassword({
        email: adminInfo.email,
        password: adminInfo.password,
        resetCode: admin.password_reset_code,
      });

      expect(response.message).toBe("Password reset successful");
    });

    it("throws an error if email is incorrect or user does not exist", async () => {
      await expect(
        authService.resetWorkerPassword({
          email: adminInfo.email,
          password: adminInfo.password,
          resetCode: "admin.password_reset_code",
        }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        authService.resetWorkerPassword({
          email: adminInfo.email,
          password: adminInfo.password,
          resetCode: "admin.password_reset_code",
        }),
      ).rejects.toThrow("User not found");
    });

    it("throws an error if worker has not requested a reset code", async () => {
      await registerWorker(adminInfo);

      await expect(
        authService.resetWorkerPassword({
          email: adminInfo.email,
          password: adminInfo.password,
          resetCode: "admin.password_reset_code",
        }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        authService.resetWorkerPassword({
          email: adminInfo.email,
          password: adminInfo.password,
          resetCode: "admin.password_reset_code",
        }),
      ).rejects.toThrow("User did not request a reset");
    });

    it("throws an error if worker reset code is incorrect", async () => {
      await registerWorker(adminInfo);
      await authService.requestWorkerPasswordReset({
        email: adminInfo.email,
      });

      await expect(
        authService.resetWorkerPassword({
          email: adminInfo.email,
          password: adminInfo.password,
          resetCode: "admin.password_reset_code",
        }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        authService.resetWorkerPassword({
          email: adminInfo.email,
          password: adminInfo.password,
          resetCode: "admin.password_reset_code",
        }),
      ).rejects.toThrow("Incorrect resetCode");
    });
  });

  const adminInfo = {
    name: "Frederick Aziebu",
    email: "frederickaziebu1998@gmail.com",
    password: "Microsoft@2021",
  };

  const registerAdmin = async ({ name, email, password }) => {
    const admin = new Admin();
    admin.email = email;
    admin.name = name;
    admin.password = await HashHelper.encrypt(password);

    return adminRepository.save(admin);
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
});
