import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthService } from "./auth.service";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { Connection, Repository } from "typeorm";
import { BadRequestException } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { QueueModule } from "../queue/queue.module";
import { EmailProducer } from "../queue/producers/email.producer";

// Dto's
import { CreateAdminBodyDto } from "./dto/create-admin-body.dto";
import { LoginBodyDto } from "./dto/login-body.dto";
import { CreateWorkersBodyDto } from "./dto/create-workers-body.dto";

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

describe("AuthController", () => {
  let authController: AuthController;
  let module: TestingModule;
  let connection: Connection;
  let emailProducer: EmailProducer;
  let adminRepository: Repository<Admin>;
  let workerRepository: Repository<Worker>;

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

    connection = module.get<Connection>(Connection);
    authController = module.get<AuthController>(AuthController);
    emailProducer = module.get<EmailProducer>(EmailProducer);
    adminRepository = module.get<Repository<Admin>>(getRepositoryToken(Admin));
    workerRepository = module.get<Repository<Worker>>(
      getRepositoryToken(Worker),
    );
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

  const createAdminBodyDto: CreateAdminBodyDto = {
    name: "Frederick Aziebu",
    email: "frederickaziebu1998@gmail.com",
    password: "Microsoft@2021",
  };

  const loginBodyDto: LoginBodyDto = {
    email: "frederickaziebu1998@gmail.com",
    password: "Microsoft@2021",
  };

  const createWorkersBodyDto: CreateWorkersBodyDto = {
    workers: [
      {
        name: "Frederick Aziebu",
        email: "fkaaziebu1998@gmail.com",
      },
      {
        name: "Happy Aziebu",
        email: "haaziebu@gmail.com",
      },
    ],
  };

  const getAdminByEmail = async (email: string) => {
    const admin = await adminRepository.findOne({
      where: { email: email },
      relations: ["workers", "farms"],
    });

    return admin;
  };

  const getWorkerByEmail = async (email: string) => {
    const worker = await workerRepository.findOne({
      where: { email: email },
    });

    return worker;
  };

  const listWorkersOfAdmin = async (email: string) => {
    const admin = await adminRepository.findOne({
      where: { email: email },
      relations: ["workers"],
    });

    return admin.workers;
  };

  describe("createAdminAccount", () => {
    it("returns success when admin registers successfully", async () => {
      const response =
        await authController.createAdminAccount(createAdminBodyDto);

      expect(response.message).toBe("Successfully signed up");

      const admin = await getAdminByEmail(createAdminBodyDto.email);
      expect(admin.email).toBe(createAdminBodyDto.email);
      expect(admin.farms.length).toEqual(0);
      expect(admin.workers.length).toEqual(0);
    });

    it("throws an error if email already exist", async () => {
      await authController.createAdminAccount(createAdminBodyDto);

      await expect(
        authController.createAdminAccount(createAdminBodyDto),
      ).rejects.toThrow(BadRequestException);

      await expect(
        authController.createAdminAccount(createAdminBodyDto),
      ).rejects.toThrow("Email already exist");
    });
  });

  describe("loginAdmin", () => {
    it("returns success when admin login successfully", async () => {
      await authController.createAdminAccount(createAdminBodyDto);
      const response = await authController.loginAdmin(loginBodyDto);

      const admin = await getAdminByEmail(createAdminBodyDto.email);
      expect(response.id).toEqual(admin.id);
      expect(response.email).toBe(admin.email);
      expect(response.role).toBe("ADMIN");
      expect(response.access_token).not.toBeUndefined();
    });

    it("throws an error when email or password is incorrect", async () => {
      await authController.createAdminAccount(createAdminBodyDto);

      await expect(
        authController.loginAdmin({
          ...loginBodyDto,
          password: "123",
        }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        authController.loginAdmin({
          ...loginBodyDto,
          password: "123",
        }),
      ).rejects.toThrow("Email or password is incorrect");

      await expect(
        authController.loginAdmin({
          ...loginBodyDto,
          email: "fkaaziebu1998@gmail.com",
        }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        authController.loginAdmin({
          ...loginBodyDto,
          email: "fkaaziebu1998@gmail.com",
        }),
      ).rejects.toThrow("Email or password is incorrect");
    });
  });

  describe("createWorkers", () => {
    const createAndLoginAdmin = async (
      email = "frederickaziebu1998@gmail.com",
    ) => {
      await authController.createAdminAccount({ ...createAdminBodyDto, email });
      const response = await authController.loginAdmin({
        ...loginBodyDto,
        email,
      });

      return {
        email: response.email,
      };
    };

    it("returns success message when workers created successfully", async () => {
      const admin = await createAndLoginAdmin();

      const response = await authController.createWorkers(
        { user: admin },
        createWorkersBodyDto,
      );

      expect(response.message).toBe("Worker(s) created successfully");

      const workers = await listWorkersOfAdmin(createAdminBodyDto.email);
      expect(workers.length).toEqual(2);
      expect(Object.keys(workers[0])).toContain("email");
    });

    it("creates only workers with emails that don't exist", async () => {
      const admin = await createAndLoginAdmin();

      await authController.createWorkers({ user: admin }, createWorkersBodyDto);

      let workers = await listWorkersOfAdmin(createAdminBodyDto.email);
      expect(workers.length).toEqual(2);

      createWorkersBodyDto.workers.push({
        name: "Philip Aziebu",
        email: "pkaaziebu1998@gmail.com",
      });

      await authController.createWorkers({ user: admin }, createWorkersBodyDto);

      workers = await listWorkersOfAdmin(createAdminBodyDto.email);
      expect(workers.length).toEqual(3);
    });

    it("throws an error for email of workers that already belong to another admin", async () => {
      const admin1 = await createAndLoginAdmin();
      const admin2 = await createAndLoginAdmin("fkaaziebu1998@gmail.com");

      await authController.createWorkers(
        { user: admin1 },
        createWorkersBodyDto,
      );

      await expect(
        authController.createWorkers({ user: admin2 }, createWorkersBodyDto),
      ).rejects.toThrow(BadRequestException);

      await expect(
        authController.createWorkers({ user: admin2 }, createWorkersBodyDto),
      ).rejects.toBeTruthy();
    });
  });

  describe("loginWorker", () => {
    const createWorker = async () => {
      await authController.createAdminAccount(createAdminBodyDto);
      const response = await authController.loginAdmin(loginBodyDto);

      await authController.createWorkers(
        { user: { ...response } },
        createWorkersBodyDto,
      );

      const email = createWorkersBodyDto.workers[0].email;
      const password = "Microsoft@2021";
      await authController.requestWorkerPasswordReset({
        email,
      });

      const worker = await getWorkerByEmail(email);

      await authController.resetWorkerPassword(
        { resetCode: worker.password_reset_code },
        { email, password },
      );
    };

    it("returns success when worker login successfully", async () => {
      await createWorker();
      const response = await authController.loginWorker({
        email: createWorkersBodyDto.workers[0].email,
        password: "Microsoft@2021",
      });

      const worker = await getWorkerByEmail(
        createWorkersBodyDto.workers[0].email,
      );
      expect(response.id).toEqual(worker.id);
      expect(response.email).toBe(worker.email);
      expect(response.role).toBe("WORKER");
      expect(response.access_token).not.toBeUndefined();
    });

    it("throws an error when worker email or password is incorrect", async () => {
      await createWorker();

      await expect(
        authController.loginWorker({
          email: createWorkersBodyDto.workers[1].email,
          password: "Microsoft@2021",
        }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        authController.loginWorker({
          email: createWorkersBodyDto.workers[1].email,
          password: "Microsoft@2021",
        }),
      ).rejects.toThrow("Email or password is incorrect");

      await expect(
        authController.loginWorker({
          email: createWorkersBodyDto.workers[0].email,
          password: "Microsoft@2022",
        }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        authController.loginWorker({
          email: createWorkersBodyDto.workers[0].email,
          password: "Microsoft@2022",
        }),
      ).rejects.toThrow("Email or password is incorrect");
    });
  });
});
