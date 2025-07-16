import { Test, TestingModule } from "@nestjs/testing";
import { Connection, Repository } from "typeorm";
import { GroupService } from "./group.service";

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
  LeafDetection,
} from "../../../database/entities";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { HashHelper } from "../../../helpers";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { EmailProducer } from "../../../modules/queue/producers/email.producer";
import { QueueModule } from "../../../modules/queue/queue.module";

describe("GroupService", () => {
  let module: TestingModule;
  let connection: Connection;
  let groupService: GroupService;
  let emailProducer: EmailProducer;
  let adminRepository: Repository<Admin>;
  let farmRepository: Repository<Farm>;
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
              LeafDetection,
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
          LeafDetection,
        ]),
      ],
      controllers: [],
      providers: [GroupService],
    }).compile();

    connection = module.get<Connection>(Connection);
    groupService = module.get<GroupService>(GroupService);
    emailProducer = module.get<EmailProducer>(EmailProducer);
    adminRepository = module.get<Repository<Admin>>(getRepositoryToken(Admin));
    farmRepository = module.get<Repository<Farm>>(getRepositoryToken(Farm));
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

    jest.spyOn(emailProducer, "sendGroupJoinRequest").mockResolvedValue(void 0);
  });

  afterAll(async () => {
    await connection.close();
    await module.close();
  });

  describe("createGroup", () => {
    it("returns created group after successfully creating group", async () => {
      await registerAdmin(adminInfo);

      await groupService.createGroup({
        email: adminInfo.email,
        name: adminInfo.groupName,
      });

      const admin = await getAdmin(adminInfo.email);

      expect(admin.groups.length).toEqual(1);
      expect(admin.groups[0].name).toBe(adminInfo.groupName);
    });

    it("throws an error if admin does not exist", async () => {
      await expect(
        groupService.createGroup({
          email: adminInfo.email,
          name: adminInfo.groupName,
        }),
      ).rejects.toThrow(NotFoundException);

      await expect(
        groupService.createGroup({
          email: adminInfo.email,
          name: adminInfo.groupName,
        }),
      ).rejects.toThrow("Admin does not exist");
    });
  });

  describe("createAuditor", () => {
    it("returns worker of role auditor after creation", async () => {
      await registerAdmin(adminInfo);

      const group = await groupService.createGroup({
        email: adminInfo.email,
        name: adminInfo.groupName,
      });

      await groupService.createAuditor({
        email: adminInfo.email,
        groupId: group.id,
        worker: adminInfo.workers[0],
      });

      const admin = await getAdmin(adminInfo.email);
      expect(admin.groups[0].workers.length).toEqual(1);
      expect(admin.groups[0].workers[0].email).toBe(adminInfo.workers[0].email);
    });

    it("throws an error if group or admin does not exist", async () => {
      await expect(
        groupService.createAuditor({
          email: adminInfo.email,
          groupId: "beeb7d59-3583-450d-9045-33c4bdb58f87",
          worker: adminInfo.workers[0],
        }),
      ).rejects.toThrow(NotFoundException);
      await expect(
        groupService.createAuditor({
          email: adminInfo.email,
          groupId: "beeb7d59-3583-450d-9045-33c4bdb58f87",
          worker: adminInfo.workers[0],
        }),
      ).rejects.toThrow("Group not found for this admin");

      await registerAdmin(adminInfo);

      await expect(
        groupService.createAuditor({
          email: adminInfo.email,
          groupId: "beeb7d59-3583-450d-9045-33c4bdb58f87",
          worker: adminInfo.workers[0],
        }),
      ).rejects.toThrow(NotFoundException);
      await expect(
        groupService.createAuditor({
          email: adminInfo.email,
          groupId: "beeb7d59-3583-450d-9045-33c4bdb58f87",
          worker: adminInfo.workers[0],
        }),
      ).rejects.toThrow("Group not found for this admin");
    });
  });

  describe("requestWorkersToJoinGroup", () => {
    it("returns success message after request has been sent successfully", async () => {
      await registerAdmin(adminInfo);
      await registerWorker({ ...adminInfo.workers[0], password: "password" });
      await registerWorker({ ...adminInfo.workers[1], password: "password" });

      const group = await groupService.createGroup({
        email: adminInfo.email,
        name: adminInfo.groupName,
      });

      await groupService.requestWorkersToJoinGroup({
        email: adminInfo.email,
        groupId: group.id,
        workerEmails: [adminInfo.workers[0].email, adminInfo.workers[1].email],
      });

      const admin = await getAdmin(adminInfo.email);
      expect(admin.groups[0].requests.length).toEqual(2);
    });
  });

  describe("requestFarmsToJoinGroup", () => {
    it("returns success message after request has been sent successfully", async () => {
      await registerAdmin(adminInfo);
      const farmOne = await createFarm({
        name: "Farm 1",
        adminEmail: "fkaaziebu1998@gmail.com",
      });
      const farmTwo = await createFarm({
        name: "Farm 2",
        adminEmail: "fkaaziebu1999@gmail.com",
      });

      const group = await groupService.createGroup({
        email: adminInfo.email,
        name: adminInfo.groupName,
      });

      await groupService.requestFarmsToJoinGroup({
        email: adminInfo.email,
        groupId: group.id,
        farmTags: [farmOne.farm_tag, farmTwo.farm_tag],
      });

      const admin = await getAdmin(adminInfo.email);
      expect(admin.groups[0].requests.length).toEqual(2);
    });
  });

  describe("acceptRequest", () => {
    it("adds worker to group when worker accepts request", async () => {
      await registerAdmin(adminInfo);
      await registerWorker({ ...adminInfo.workers[0], password: "password" });

      const group = await groupService.createGroup({
        email: adminInfo.email,
        name: adminInfo.groupName,
      });

      await groupService.requestWorkersToJoinGroup({
        email: adminInfo.email,
        groupId: group.id,
        workerEmails: [adminInfo.workers[0].email],
      });

      let admin = await getAdmin(adminInfo.email);
      await groupService.acceptRequest({
        email: adminInfo.workers[0].email,
        requestId: admin.groups[0].requests[0].id,
        role: "WORKER",
      });

      admin = await getAdmin(adminInfo.email);
      expect(admin.groups[0].workers.length).toEqual(1);
    });

    it("adds farm to group when admin accepts request", async () => {
      await registerAdmin(adminInfo);
      const farmOne = await createFarm({
        name: "Farm 1",
        adminEmail: "fkaaziebu1998@gmail.com",
      });

      const group = await groupService.createGroup({
        email: adminInfo.email,
        name: adminInfo.groupName,
      });

      await groupService.requestFarmsToJoinGroup({
        email: adminInfo.email,
        groupId: group.id,
        farmTags: [farmOne.farm_tag],
      });

      let admin = await getAdmin(adminInfo.email);
      await groupService.acceptRequest({
        email: "fkaaziebu1998@gmail.com",
        requestId: admin.groups[0].requests[0].id,
        role: "ADMIN",
      });

      admin = await getAdmin(adminInfo.email);
      expect(admin.groups[0].farms.length).toEqual(1);
    });
  });

  describe("createReport", () => {
    it("returns created report for auditor", async () => {
      await registerAdmin(adminInfo);
      await registerWorker({ ...adminInfo.workers[0], password: "password" });
      const farmOne = await createFarm({
        name: "Farm 1",
        adminEmail: "fkaaziebu1998@gmail.com",
      });

      const group = await groupService.createGroup({
        email: adminInfo.email,
        name: adminInfo.groupName,
      });

      await groupService.requestWorkersToJoinGroup({
        email: adminInfo.email,
        groupId: group.id,
        workerEmails: [adminInfo.workers[0].email],
      });

      await groupService.requestFarmsToJoinGroup({
        email: adminInfo.email,
        groupId: group.id,
        farmTags: [farmOne.farm_tag],
      });

      const admin = await getAdmin(adminInfo.email);
      await groupService.acceptRequest({
        email: adminInfo.workers[0].email,
        requestId: admin.groups[0].requests[0].id,
        role: "WORKER",
      });

      await groupService.acceptRequest({
        email: "fkaaziebu1998@gmail.com",
        requestId: admin.groups[0].requests[1].id,
        role: "ADMIN",
      });

      const response = await groupService.createReport({
        email: adminInfo.workers[0].email,
        farmTag: farmOne.farm_tag,
      });

      expect(response.verified).toBeFalsy();
      expect(response.completed).toBeFalsy();
    });

    it("throws an erro if worker does not belong to the farm", async () => {
      await expect(
        groupService.createReport({
          email: adminInfo.workers[0].email,
          farmTag: "fb96af68-8f17-4e59-b50e-6cd94a81d904",
        }),
      ).rejects.toThrow(NotFoundException);

      await expect(
        groupService.createReport({
          email: adminInfo.workers[0].email,
          farmTag: "fb96af68-8f17-4e59-b50e-6cd94a81d904",
        }),
      ).rejects.toThrow("Worker does not belong to this farm");
    });
  });

  describe("verifyReport", () => {
    it("renders the report verified after worker verifies it", async () => {
      await registerAdmin(adminInfo);
      await registerWorker({ ...adminInfo.workers[0], password: "password" });
      const farmOne = await createFarm({
        name: "Farm 1",
        adminEmail: "fkaaziebu1998@gmail.com",
      });

      const group = await groupService.createGroup({
        email: adminInfo.email,
        name: adminInfo.groupName,
      });

      await groupService.requestWorkersToJoinGroup({
        email: adminInfo.email,
        groupId: group.id,
        workerEmails: [adminInfo.workers[0].email],
      });

      await groupService.requestFarmsToJoinGroup({
        email: adminInfo.email,
        groupId: group.id,
        farmTags: [farmOne.farm_tag],
      });

      let admin = await getAdmin(adminInfo.email);
      await groupService.acceptRequest({
        email: adminInfo.workers[0].email,
        requestId: admin.groups[0].requests[0].id,
        role: "WORKER",
      });

      await groupService.acceptRequest({
        email: "fkaaziebu1998@gmail.com",
        requestId: admin.groups[0].requests[1].id,
        role: "ADMIN",
      });

      const report = await groupService.createReport({
        email: adminInfo.workers[0].email,
        farmTag: farmOne.farm_tag,
      });

      admin = await getAdmin("fkaaziebu1998@gmail.com");

      const response = await groupService.verifyReport({
        email: adminInfo.workers[0].email,
        reportId: report.id,
        verificationCode: admin.farms[0].verification_code,
        coordinate: {
          lat: 0,
          lon: 0,
        },
      });

      expect(response.verified).toBeTruthy();
    });

    it("throws an error if report not found", async () => {
      await expect(
        groupService.verifyReport({
          email: adminInfo.workers[0].email,
          reportId: "fb96af68-8f17-4e59-b50e-6cd94a81d904",
          verificationCode: "fb96af68-8f17-4e59-b50e-6cd94a81d904",
          coordinate: {
            lat: 6.266741524410753,
            lon: 0.04420958275423949,
          },
        }),
      ).rejects.toThrow(NotFoundException);

      await expect(
        groupService.verifyReport({
          email: adminInfo.workers[0].email,
          reportId: "fb96af68-8f17-4e59-b50e-6cd94a81d904",
          verificationCode: "fb96af68-8f17-4e59-b50e-6cd94a81d904",
          coordinate: {
            lat: 6.266741524410753,
            lon: 0.04420958275423949,
          },
        }),
      ).rejects.toThrow("Report not found");
    });

    it("throws an error if qrcode is invalid", async () => {
      await registerAdmin(adminInfo);
      await registerWorker({ ...adminInfo.workers[0], password: "password" });
      const farmOne = await createFarm({
        name: "Farm 1",
        adminEmail: "fkaaziebu1998@gmail.com",
      });

      const group = await groupService.createGroup({
        email: adminInfo.email,
        name: adminInfo.groupName,
      });

      await groupService.requestWorkersToJoinGroup({
        email: adminInfo.email,
        groupId: group.id,
        workerEmails: [adminInfo.workers[0].email],
      });

      await groupService.requestFarmsToJoinGroup({
        email: adminInfo.email,
        groupId: group.id,
        farmTags: [farmOne.farm_tag],
      });

      let admin = await getAdmin(adminInfo.email);
      await groupService.acceptRequest({
        email: adminInfo.workers[0].email,
        requestId: admin.groups[0].requests[0].id,
        role: "WORKER",
      });

      await groupService.acceptRequest({
        email: "fkaaziebu1998@gmail.com",
        requestId: admin.groups[0].requests[1].id,
        role: "ADMIN",
      });

      const report = await groupService.createReport({
        email: adminInfo.workers[0].email,
        farmTag: farmOne.farm_tag,
      });

      admin = await getAdmin("fkaaziebu1998@gmail.com");

      await expect(
        groupService.verifyReport({
          email: adminInfo.workers[0].email,
          reportId: report.id,
          verificationCode: "fb96af68-8f17-4e59-b50e-6cd94a81d904",
          coordinate: {
            lat: 0,
            lon: 0,
          },
        }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        groupService.verifyReport({
          email: adminInfo.workers[0].email,
          reportId: report.id,
          verificationCode: "fb96af68-8f17-4e59-b50e-6cd94a81d904",
          coordinate: {
            lat: 0,
            lon: 0,
          },
        }),
      ).rejects.toThrow("QR code is invalid");
    });
  });

  describe("updateReport", () => {});

  describe("completeReport", () => {
    it("returns completed report after AUDITOR completes it", async () => {
      await registerAdmin(adminInfo);
      await registerWorker({ ...adminInfo.workers[0], password: "password" });
      const farmOne = await createFarm({
        name: "Farm 1",
        adminEmail: "fkaaziebu1998@gmail.com",
      });

      const group = await groupService.createGroup({
        email: adminInfo.email,
        name: adminInfo.groupName,
      });

      await groupService.requestWorkersToJoinGroup({
        email: adminInfo.email,
        groupId: group.id,
        workerEmails: [adminInfo.workers[0].email],
      });

      await groupService.requestFarmsToJoinGroup({
        email: adminInfo.email,
        groupId: group.id,
        farmTags: [farmOne.farm_tag],
      });

      let admin = await getAdmin(adminInfo.email);
      await groupService.acceptRequest({
        email: adminInfo.workers[0].email,
        requestId: admin.groups[0].requests[0].id,
        role: "WORKER",
      });

      await groupService.acceptRequest({
        email: "fkaaziebu1998@gmail.com",
        requestId: admin.groups[0].requests[1].id,
        role: "ADMIN",
      });

      const report = await groupService.createReport({
        email: adminInfo.workers[0].email,
        farmTag: farmOne.farm_tag,
      });

      admin = await getAdmin("fkaaziebu1998@gmail.com");

      await groupService.verifyReport({
        email: adminInfo.workers[0].email,
        reportId: report.id,
        verificationCode: admin.farms[0].verification_code,
        coordinate: {
          lat: 0,
          lon: 0,
        },
      });

      const response = await groupService.completeReport({
        email: adminInfo.workers[0].email,
        reportId: report.id,
      });

      expect(response.completed).toBeTruthy();
    });

    it("throws an error if the report is not verified", async () => {
      await registerAdmin(adminInfo);
      await registerWorker({ ...adminInfo.workers[0], password: "password" });
      const farmOne = await createFarm({
        name: "Farm 1",
        adminEmail: "fkaaziebu1998@gmail.com",
      });

      const group = await groupService.createGroup({
        email: adminInfo.email,
        name: adminInfo.groupName,
      });

      await groupService.requestWorkersToJoinGroup({
        email: adminInfo.email,
        groupId: group.id,
        workerEmails: [adminInfo.workers[0].email],
      });

      await groupService.requestFarmsToJoinGroup({
        email: adminInfo.email,
        groupId: group.id,
        farmTags: [farmOne.farm_tag],
      });

      let admin = await getAdmin(adminInfo.email);
      await groupService.acceptRequest({
        email: adminInfo.workers[0].email,
        requestId: admin.groups[0].requests[0].id,
        role: "WORKER",
      });

      await groupService.acceptRequest({
        email: "fkaaziebu1998@gmail.com",
        requestId: admin.groups[0].requests[1].id,
        role: "ADMIN",
      });

      const report = await groupService.createReport({
        email: adminInfo.workers[0].email,
        farmTag: farmOne.farm_tag,
      });

      admin = await getAdmin("fkaaziebu1998@gmail.com");

      await expect(
        groupService.completeReport({
          email: adminInfo.workers[0].email,
          reportId: report.id,
        }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        groupService.completeReport({
          email: adminInfo.workers[0].email,
          reportId: report.id,
        }),
      ).rejects.toThrow(
        "This report is not verified, please verify and update before completing",
      );
    });

    it("throws an error if the report is not found", async () => {
      await expect(
        groupService.completeReport({
          email: adminInfo.workers[0].email,
          reportId: "fb96af68-8f17-4e59-b50e-6cd94a81d904",
        }),
      ).rejects.toThrow(NotFoundException);

      await expect(
        groupService.completeReport({
          email: adminInfo.workers[0].email,
          reportId: "fb96af68-8f17-4e59-b50e-6cd94a81d904",
        }),
      ).rejects.toThrow("Report not found");
    });
  });

  // QUERIES
  describe("listGroups", () => {
    it("returns a list of admin groups", async () => {
      await registerAdmin(adminInfo);

      await groupService.createGroup({
        email: adminInfo.email,
        name: adminInfo.groupName,
      });
      await groupService.createGroup({
        email: adminInfo.email,
        name: adminInfo.groupName,
      });

      const response = await groupService.listGroups({
        email: adminInfo.email,
      });

      expect(response.length).toEqual(2);
    });
  });

  describe("listGroupAuditors", () => {
    it("returns a list of admin groups", async () => {
      await registerAdmin(adminInfo);

      const group = await groupService.createGroup({
        email: adminInfo.email,
        name: adminInfo.groupName,
      });

      await groupService.createAuditor({
        email: adminInfo.email,
        groupId: group.id,
        worker: adminInfo.workers[0],
      });

      const response = await groupService.listGroupAuditors({
        email: adminInfo.email,
        groupId: group.id,
      });

      expect(response.length).toEqual(1);
    });
  });

  describe("listGroupFarms", () => {
    it("returns a list of admin group farms", async () => {
      await registerAdmin(adminInfo);

      const group = await groupService.createGroup({
        email: adminInfo.email,
        name: adminInfo.groupName,
      });

      const farmOne = await createFarm({
        name: "Farm 1",
        adminEmail: "fkaaziebu1998@gmail.com",
      });

      await groupService.requestFarmsToJoinGroup({
        email: adminInfo.email,
        groupId: group.id,
        farmTags: [farmOne.farm_tag],
      });

      const admin = await getAdmin(adminInfo.email);
      await groupService.acceptRequest({
        email: "fkaaziebu1998@gmail.com",
        requestId: admin.groups[0].requests[0].id,
        role: "ADMIN",
      });

      const response = await groupService.listGroupFarms({
        email: adminInfo.email,
        groupId: group.id,
      });

      expect(response.length).toEqual(1);
    });
  });

  describe("getGroup", () => {
    it("returns group for an admin", async () => {
      await registerAdmin(adminInfo);

      const group = await groupService.createGroup({
        email: adminInfo.email,
        name: adminInfo.groupName,
      });

      const response = await groupService.getGroup({
        email: adminInfo.email,
        groupId: group.id,
      });

      expect(response.name).toBe(adminInfo.groupName);
      expect(response.id).toBe(group.id);
    });
  });

  describe("getGroupAuditor", () => {
    it("returns group auditor for an admin", async () => {
      await registerAdmin(adminInfo);

      const group = await groupService.createGroup({
        email: adminInfo.email,
        name: adminInfo.groupName,
      });

      const auditor = await groupService.createAuditor({
        email: adminInfo.email,
        groupId: group.id,
        worker: adminInfo.workers[0],
      });

      const response = await groupService.getGroupAuditor({
        email: adminInfo.email,
        groupId: group.id,
        workerTag: auditor.worker_tag,
      });

      expect(response.name).toBe(adminInfo.workers[0].name);
      expect(response.email).toBe(adminInfo.workers[0].email);
    });
  });

  const adminInfo = {
    name: "Frederick Aziebu",
    email: "frederickaziebu1998@gmail.com",
    password: "Microsoft@2021",
    groupName: "Fred Groups",
    workers: [
      {
        name: "John Doe",
        email: "johndoe@gmail.com",
      },

      {
        name: "Delali Dorwu",
        email: "delalidorwu@gmail.com",
      },
    ],
  };

  const getAdmin = async (email: string) => {
    const admin = await adminRepository.findOne({
      where: { email },
      relations: [
        "groups.workers",
        "groups.requests.worker",
        "groups.requests.farm",
        "groups.farms",
        "farms",
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

  const registerWorker = async ({ name, email, password }) => {
    const worker = new Worker();

    worker.name = name;
    worker.email = email;
    worker.password = await HashHelper.encrypt(password);

    return await workerRepository.save(worker);
  };

  const createFarm = async ({ name, adminEmail }) => {
    const admin = await registerAdmin({
      ...adminInfo,
      email: adminEmail,
    });

    const farm = new Farm();

    farm.name = name;
    const savedFarm = await farmRepository.save(farm);

    if (!admin.farms) {
      admin.farms = [];
    }

    admin.farms.push(savedFarm);
    await adminRepository.save(admin);

    return await farmRepository.save(farm);
  };
});
