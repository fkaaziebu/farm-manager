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
import { EmailProducer } from "../../../modules/queue/producers/email.producer";
import { QueueModule } from "../../queue/queue.module";
import { AdminService } from "./admin.service";

describe("AdminService", () => {
  let module: TestingModule;
  let adminService: AdminService;
  let connection: Connection;
  let emailProducer: EmailProducer;
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
      providers: [AdminService],
    }).compile();

    connection = module.get<Connection>(Connection);
    adminService = module.get<AdminService>(AdminService);
    emailProducer = module.get<EmailProducer>(EmailProducer);
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

  describe("registerAdmin", () => {
    it("returns admin after successful registration", async () => {
      const response = await adminService.registerAdmin(adminInfo);

      expect(response.email).toBe(adminInfo.email);
      expect(response.name).toBe(adminInfo.name);
      expect(response.farms).toBeUndefined();
      expect(response.assigned_tasks).toBeUndefined();
      expect(response.workers).toBeUndefined();
    });

    it("throws an error if admin already exist", async () => {
      await adminService.registerAdmin(adminInfo);

      await expect(adminService.registerAdmin(adminInfo)).rejects.toThrow(
        BadRequestException,
      );

      await expect(adminService.registerAdmin(adminInfo)).rejects.toThrow(
        "Email already exist",
      );
    });
  });

  describe("createIAMUsers", () => {
    it("returns admin with iam_users after successful creation", async () => {
      await adminService.registerAdmin(adminInfo);

      await adminService.createIAMUsers({
        email: adminInfo.email,
        iamUsers: [{ name: "Frederick Aziebu", password: "12345678910" }],
      });

      const admin = await getAdmin(adminInfo.email);

      expect(admin.iam_users.length).toEqual(1);
      expect(admin.iam_users[0].name).toBe("Frederick Aziebu");
    });

    it("throws an error if admin does not exist", async () => {
      await expect(
        adminService.createIAMUsers({
          email: adminInfo.email,
          iamUsers: [{ name: "Frederick Aziebu", password: "12345678910" }],
        }),
      ).rejects.toThrow(new NotFoundException("This admin does not exist"));
    });
  });

  describe("updateIAMUsers", () => {
    it("returns updated iam_user after successful updating", async () => {
      await adminService.registerAdmin(adminInfo);

      await adminService.createIAMUsers({
        email: adminInfo.email,
        iamUsers: [{ name: "Frederick Aziebu", password: "12345678910" }],
      });

      const iamUser = (await getAdmin(adminInfo.email)).iam_users[0];

      expect(iamUser.name).toBe("Frederick Aziebu");

      await adminService.updateIAMUser({
        iamIdentifier: iamUser.iam_identifier,
        email: adminInfo.email,
        name: "Frederick Aziebu V@",
        password: "12345678910",
      });

      const admin = await getAdmin(adminInfo.email);

      expect(admin.iam_users.length).toEqual(1);
      expect(admin.iam_users[0].name).toBe("Frederick Aziebu V@");
    });

    it("throws an error if iam_user does not exist", async () => {
      await expect(
        adminService.updateIAMUser({
          iamIdentifier: "1234",
          email: adminInfo.email,
          name: "Frederick Aziebu",
          password: "12345678910",
        }),
      ).rejects.toThrow(new NotFoundException("Iam User does not exist"));

      await adminService.registerAdmin(adminInfo);
      await expect(
        adminService.updateIAMUser({
          iamIdentifier: "1234",
          email: adminInfo.email,
          name: "Frederick Aziebu",
          password: "12345678910",
        }),
      ).rejects.toThrow(new NotFoundException("Iam User does not exist"));
    });
  });

  describe("loginAdmin", () => {
    it("returns admin with token after successful login", async () => {
      await adminService.registerAdmin(adminInfo);

      const response = await adminService.loginAdmin({
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
      await adminService.registerAdmin(adminInfo);

      await expect(
        adminService.loginAdmin({
          email: adminInfo.email,
          password: "123",
        }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        adminService.loginAdmin({
          email: adminInfo.email,
          password: "123",
        }),
      ).rejects.toThrow("Email or password is incorrect");

      await expect(
        adminService.loginAdmin({
          email: "fkaaziebu1998@gmail.com",
          password: adminInfo.password,
        }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        adminService.loginAdmin({
          email: "fkaaziebu1998@gmail.com",
          password: adminInfo.password,
        }),
      ).rejects.toThrow("Email or password is incorrect");
    });
  });

  describe("loginIAMUser", () => {
    it("returns admin with token after successful login", async () => {
      await adminService.registerAdmin(adminInfo);

      await adminService.createIAMUsers({
        email: adminInfo.email,
        iamUsers: [{ name: "Frederick Aziebu", password: "12345678910" }],
      });

      const iamUser = (await getAdmin(adminInfo.email)).iam_users[0];

      const response = await adminService.loginIAMUser({
        iamIdentifier: iamUser.iam_identifier,
        password: "12345678910",
      });

      expect(response.email).toBe(adminInfo.email);
      expect(response.name).toBe(adminInfo.name);
      expect(response.farms).toBeUndefined();
      expect(response.assigned_tasks).toBeUndefined();
      expect(response.workers).toBeUndefined();
      expect(response.token).not.toBeUndefined();
    });

    it("throws an error if identifier or password is incorrect", async () => {
      await adminService.registerAdmin(adminInfo);

      await adminService.createIAMUsers({
        email: adminInfo.email,
        iamUsers: [{ name: "Frederick Aziebu", password: "12345678910" }],
      });

      const iamUser = (await getAdmin(adminInfo.email)).iam_users[0];

      await expect(
        adminService.loginIAMUser({
          iamIdentifier: iamUser.iam_identifier,
          password: "1234567891011",
        }),
      ).rejects.toThrow(
        new BadRequestException("Iam identifier or password is incorrect"),
      );

      await expect(
        adminService.loginIAMUser({
          iamIdentifier: "12345678910",
          password: "12345678910",
        }),
      ).rejects.toThrow(
        new BadRequestException("Iam identifier or password is incorrect"),
      );
    });
  });

  describe("listIAMUsers", () => {
    it("should return a list of iam users", async () => {
      await adminService.registerAdmin(adminInfo);

      await adminService.createIAMUsers({
        email: adminInfo.email,
        iamUsers: [
          { name: "Frederick Aziebu", password: "12345678910" },
          { name: "Delali Elorm", password: "12345678910" },
        ],
      });

      let iamUsers = await adminService.listIAMUsers({
        email: adminInfo.email,
        searchTerm: "",
      });

      expect(iamUsers).toHaveLength(2);

      iamUsers = await adminService.listIAMUsers({
        email: adminInfo.email,
        searchTerm: "Fred",
      });

      expect(iamUsers).toHaveLength(1);
      expect(iamUsers[0].name).toBe("Frederick Aziebu");
    });
  });

  describe("getIAMUser", () => {
    it("should return barn with provided unit id", async () => {
      await adminService.registerAdmin(adminInfo);

      await adminService.createIAMUsers({
        email: adminInfo.email,
        iamUsers: [
          { name: "Frederick Aziebu", password: "12345678910" },
          { name: "Delali Elorm", password: "12345678910" },
        ],
      });

      const iamUser = (await getAdmin(adminInfo.email)).iam_users[0];

      const iam_user = await adminService.getIamUser({
        email: adminInfo.email,
        iamIdentifier: iamUser.iam_identifier,
      });

      expect(iam_user).toBeDefined();
      expect(iam_user.name).toContain(iamUser.name);
    });
  });

  describe("loginAdminWithOTP", () => {
    it("returns token and other info after successful login", async () => {
      await adminService.registerAdmin(adminInfo);
      await adminService.requestAdminLoginWithOTP({
        email: adminInfo.email,
      });

      const admin = await getAdmin(adminInfo.email);

      const response = await adminService.loginAdminWithOTP({
        email: adminInfo.email,
        otpCode: admin.otp_code,
      });

      expect(response.token).not.toBeNull();
      expect(response.otp_code).toBeNull();
      expect(response.otp_request_date).toBeNull();
    });

    it("throws an error if email or otp_code is incorrect", async () => {
      await adminService.registerAdmin(adminInfo);

      await expect(
        adminService.loginAdminWithOTP({
          email: adminInfo.email,
          otpCode: "123",
        }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        adminService.loginAdminWithOTP({
          email: adminInfo.email,
          otpCode: "123",
        }),
      ).rejects.toThrow("Email or otp code is incorrect");

      await adminService.requestAdminLoginWithOTP({
        email: adminInfo.email,
      });

      const admin = await getAdmin(adminInfo.email);

      await expect(
        adminService.loginAdminWithOTP({
          email: "fkaaziebu1998@gmail.com",
          otpCode: admin.otp_code,
        }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        adminService.loginAdminWithOTP({
          email: "fkaaziebu1998@gmail.com",
          otpCode: admin.otp_code,
        }),
      ).rejects.toThrow("Email or otp code is incorrect");
    });
  });

  describe("requestAdminOTPLogin", () => {
    it("returns success message when login successful", async () => {
      await adminService.registerAdmin(adminInfo);
      const response = await adminService.requestAdminLoginWithOTP({
        email: adminInfo.email,
      });

      expect(response.message).toBe(
        "OTP code sent to your email or sms, check to continue!",
      );

      const admin = await getAdmin(adminInfo.email);

      expect(admin.otp_code).not.toBeNull();
      expect(admin.otp_request_date).not.toBeNull();
    });

    it("throws an error when admin does not exist", async () => {
      await expect(
        adminService.requestAdminLoginWithOTP({
          email: adminInfo.email,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("requestAdminPasswordReset", () => {
    it("returns a message of \`Password reset details sent to your email!\` when successful", async () => {
      await adminService.registerAdmin(adminInfo);

      const response = await adminService.requestAdminPasswordReset({
        email: adminInfo.email,
      });

      expect(response.message).toBe(
        "Password reset details sent to your email!",
      );
    });

    it("throws an error if email is incorrect or not found", async () => {
      await expect(
        adminService.requestAdminPasswordReset({
          email: "fkaaziebu1998@gmail.com",
        }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        adminService.requestAdminPasswordReset({
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
      await adminService.registerAdmin(adminInfo);
      await adminService.requestAdminPasswordReset({
        email: adminInfo.email,
      });

      const admin = await getAdminByEmail(adminInfo.email);
      const response = await adminService.resetAdminPassword({
        email: adminInfo.email,
        password: adminInfo.password,
        resetCode: admin.password_reset_code,
      });

      expect(response.message).toBe("Password reset successful");
    });

    it("throws an error if email is incorrect or user does not exist", async () => {
      await expect(
        adminService.resetAdminPassword({
          email: adminInfo.email,
          password: adminInfo.password,
          resetCode: "admin.password_reset_code",
        }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        adminService.resetAdminPassword({
          email: adminInfo.email,
          password: adminInfo.password,
          resetCode: "admin.password_reset_code",
        }),
      ).rejects.toThrow("User not found");
    });

    it("throws an error if admin has not requested a reset code", async () => {
      await adminService.registerAdmin(adminInfo);

      await expect(
        adminService.resetAdminPassword({
          email: adminInfo.email,
          password: adminInfo.password,
          resetCode: "admin.password_reset_code",
        }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        adminService.resetAdminPassword({
          email: adminInfo.email,
          password: adminInfo.password,
          resetCode: "admin.password_reset_code",
        }),
      ).rejects.toThrow("User did not request a reset");
    });

    it("throws an error if admin reset code is incorrect", async () => {
      await adminService.registerAdmin(adminInfo);
      await adminService.requestAdminPasswordReset({
        email: adminInfo.email,
      });

      await expect(
        adminService.resetAdminPassword({
          email: adminInfo.email,
          password: adminInfo.password,
          resetCode: "admin.password_reset_code",
        }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        adminService.resetAdminPassword({
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

  const getAdmin = async (email: string) => {
    return adminRepository.findOne({
      where: {
        email,
      },
      relations: ["iam_users"],
    });
  };
});
