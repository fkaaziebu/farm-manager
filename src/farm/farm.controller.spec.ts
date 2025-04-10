import { Test, TestingModule } from "@nestjs/testing";
import { FarmController } from "./farm.controller";
import { Connection, Repository } from "typeorm";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { FarmService } from "./farm.service";
import * as bcrypt from "bcrypt";
import { BadRequestException } from "@nestjs/common";
import { PaginationService } from "./pagination/pagination.service";

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

describe("FarmController", () => {
  let farmController: FarmController;
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
    farmController = module.get<FarmController>(FarmController);
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

  const createAdminAccountWithFarmAndWorkers = async () => {
    await createAdminAccount();

    await farmController.createFarm(
      {
        user: {
          email: adminInfo.email,
        },
      },
      {
        name: "Frederick Farms 1",
        location: "Location",
        area: "Area",
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

  describe("createFarm", () => {
    it("returns success when admin creates a farm", async () => {
      await createAdminAccount();

      const response = await farmController.createFarm(
        {
          user: {
            email: adminInfo.email,
          },
        },
        {
          name: "Frederick Farms 1",
          location: "Location",
          area: "Area",
        },
      );

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

      const response = await farmController.createFarm(
        {
          user: {
            email: adminInfo.email,
          },
        },
        {
          name: "Frederick Farms 1",
          location: "Location",
          area: "Area",
        },
      );

      await expect(
        farmController.createFarm(
          {
            user: {
              email: adminInfo.email,
            },
          },
          {
            name: "Frederick Farms 1",
            location: "Location",
            area: "Area",
          },
        ),
      ).rejects.toThrow(BadRequestException);

      await expect(
        farmController.createFarm(
          {
            user: {
              email: adminInfo.email,
            },
          },
          {
            name: "Frederick Farms 1",
            location: "Location",
            area: "Area",
          },
        ),
      ).rejects.toThrow("This name is already in use");

      await expect(
        farmController.createFarm(
          {
            user: {
              email: "fkaaziebu1998@gmail.com",
            },
          },
          {
            name: "Frederick Farms 1",
            location: "Location",
            area: "Area",
          },
        ),
      ).rejects.toThrow(BadRequestException);

      await expect(
        farmController.createFarm(
          {
            user: {
              email: "fkaaziebu1998@gmail.com",
            },
          },
          {
            name: "Frederick Farms 1",
            location: "Location",
            area: "Area",
          },
        ),
      ).rejects.toThrow("This name is already in use");
    });
  });

  describe("addFarmWorkers", () => {
    it("returns success message when admin adds workers to a farm", async () => {
      await createAdminAccountWithFarmAndWorkers();
      let adminFarms = await getAdminFarms(adminInfo.email);
      const adminWorkers = await getAdminWorkers(adminInfo.email);

      let response = await farmController.addFarmWorkers(
        {
          user: {
            email: adminInfo.email,
          },
        },
        {
          farmId: `${adminFarms[0].id}`,
        },
        {
          workerIds: adminWorkers.map((wk) => ({
            id: wk.id,
          })),
        },
      );

      expect(response.message).toBe(
        `${adminWorkers.length} out of ${adminWorkers.length} Worker(s) added to farm successfully`,
      );

      response = await farmController.addFarmWorkers(
        {
          user: {
            email: adminInfo.email,
          },
        },
        {
          farmId: `${adminFarms[0].id}`,
        },
        {
          workerIds: adminWorkers.map((wk) => ({
            id: wk.id,
          })),
        },
      );

      expect(response.message).toBe(
        `0 out of ${adminWorkers.length} Worker(s) added to farm successfully`,
      );

      adminFarms = await getAdminFarms(adminInfo.email);
      expect(adminFarms[0].workers.length).toEqual(2);
    });
  });

  describe("addHousesToFarm", () => {
    it("returns success message when admin adds a house to a farm", async () => {
      await createAdminAccountWithFarmAndWorkers();
      let adminFarms = await getAdminFarms(adminInfo.email);
      const houses = [{ house_number: "A123" }, { house_number: "B123" }];

      let response = await farmController.addHousesToFarm(
        {
          user: {
            email: adminInfo.email,
          },
        },
        {
          farmId: `${adminFarms[0].id}`,
        },
        {
          houses,
        },
      );

      expect(response.message).toBe(
        `2 out of ${houses.length} houses added to farm`,
      );

      response = await farmController.addHousesToFarm(
        {
          user: {
            email: adminInfo.email,
          },
        },
        {
          farmId: `${adminFarms[0].id}`,
        },
        {
          houses,
        },
      );

      expect(response.message).toBe(
        `0 out of ${houses.length} houses added to farm`,
      );

      adminFarms = await getAdminFarms(adminInfo.email);
      expect(adminFarms[0].houses.length).toEqual(2);
    });
  });

  describe("addRoomsToHouse", () => {
    it("returns success when rooms are added to a farm successfully", async () => {
      await createAdminAccountWithFarmAndWorkers();
      let adminFarms = await getAdminFarms(adminInfo.email);
      const houses = [{ house_number: "A123" }, { house_number: "B123" }];
      const rooms = [{ room_number: "A123" }, { room_number: "B123" }];

      await farmController.addHousesToFarm(
        {
          user: {
            email: adminInfo.email,
          },
        },
        {
          farmId: `${adminFarms[0].id}`,
        },
        {
          houses,
        },
      );

      const response = await farmController.addRoomsToHouse(
        {
          user: {
            email: adminInfo.email,
          },
        },
        {
          farmId: `${adminFarms[0].id}`,
          houseNumber: houses[0].house_number,
        },
        {
          rooms,
        },
      );

      expect(response.message).toBe("Rooms added to house successfully");

      adminFarms = await getAdminFarms(adminInfo.email);

      expect(
        adminFarms[0].houses.find(
          (hs) => hs.house_number === houses[0].house_number,
        ).rooms.length,
      ).toEqual(2);
    });
  });

  describe("addAnimalsToRoom", () => {
    const houses = [{ house_number: "A123" }, { house_number: "B123" }];
    const rooms = [{ room_number: "A123" }, { room_number: "B123" }];
    enum Gender {
      MALE = "MALE",
      FEMALE = "FEMALE",
    }
    const animals = [
      {
        tag_number: "BF01",
        gender: Gender.FEMALE,
        birth_date: new Date("2025-01-01T14:30:45.123Z"),
        breed: "ALBINO",
      },
      {
        tag_number: "BF02",
        gender: Gender.MALE,
        birth_date: new Date("2025-01-01T14:30:45.123Z"),
        breed: "ALBINO",
      },
    ];

    const setupEverything = async () => {
      await createAdminAccountWithFarmAndWorkers();
      const adminFarms = await getAdminFarms(adminInfo.email);

      await farmController.addHousesToFarm(
        {
          user: {
            email: adminInfo.email,
          },
        },
        {
          farmId: `${adminFarms[0].id}`,
        },
        {
          houses,
        },
      );

      await farmController.addRoomsToHouse(
        {
          user: {
            email: adminInfo.email,
          },
        },
        {
          farmId: `${adminFarms[0].id}`,
          houseNumber: houses[0].house_number,
        },
        {
          rooms,
        },
      );
    };

    it("returns success message when animals are added to a room", async () => {
      await setupEverything();
      const adminFarms = await getAdminFarms(adminInfo.email);

      const response = await farmController.addAnimalsToRoom(
        {
          user: {
            email: adminInfo.email,
          },
        },
        {
          farmId: `${adminFarms[0].id}`,
          houseNumber: houses[0].house_number,
          roomNumber: rooms[0].room_number,
        },
        {
          animals,
        },
      );

      expect(response.message).toBe("Animals added to room successfully");
    });

    it("throws an error if either farm, house or room does not belong to admin", async () => {
      await setupEverything();
      const adminFarms = await getAdminFarms(adminInfo.email);

      await expect(
        farmController.addAnimalsToRoom(
          {
            user: {
              email: adminInfo.email,
            },
          },
          {
            farmId: `${adminFarms[0].id}`,
            houseNumber: houses[0].house_number,
            roomNumber: "A1234",
          },
          {
            animals,
          },
        ),
      ).rejects.toThrow(BadRequestException);

      await expect(
        farmController.addAnimalsToRoom(
          {
            user: {
              email: adminInfo.email,
            },
          },
          {
            farmId: `${adminFarms[0].id}`,
            houseNumber: houses[1].house_number,
            roomNumber: rooms[0].room_number,
          },
          {
            animals,
          },
        ),
      ).rejects.toThrow(BadRequestException);

      await expect(
        farmController.addAnimalsToRoom(
          {
            user: {
              email: adminInfo.email,
            },
          },
          {
            farmId: `${12345}`,
            houseNumber: houses[0].house_number,
            roomNumber: rooms[0].room_number,
          },
          {
            animals,
          },
        ),
      ).rejects.toThrow(BadRequestException);

      await expect(
        farmController.addAnimalsToRoom(
          {
            user: {
              email: adminInfo.email,
            },
          },
          {
            farmId: `${adminFarms[0].id}`,
            houseNumber: houses[0].house_number,
            roomNumber: "A1234",
          },
          {
            animals,
          },
        ),
      ).rejects.toThrow(
        "Either farm or house or rooms does not belong to admin",
      );
    });

    it("throws an error if animal tag_number is taken", async () => {
      await setupEverything();
      const adminFarms = await getAdminFarms(adminInfo.email);
      await farmController.addAnimalsToRoom(
        {
          user: {
            email: adminInfo.email,
          },
        },
        {
          farmId: `${adminFarms[0].id}`,
          houseNumber: houses[0].house_number,
          roomNumber: rooms[0].room_number,
        },
        {
          animals,
        },
      );

      await expect(
        farmController.addAnimalsToRoom(
          {
            user: {
              email: adminInfo.email,
            },
          },
          {
            farmId: `${adminFarms[0].id}`,
            houseNumber: houses[0].house_number,
            roomNumber: rooms[1].room_number,
          },
          {
            animals,
          },
        ),
      ).rejects.toThrow(BadRequestException);

      await expect(
        farmController.addAnimalsToRoom(
          {
            user: {
              email: adminInfo.email,
            },
          },
          {
            farmId: `${adminFarms[0].id}`,
            houseNumber: houses[0].house_number,
            roomNumber: rooms[1].room_number,
          },
          {
            animals: [animals[0]],
          },
        ),
      ).rejects.toThrow(
        `The tag number ${animals[0].tag_number} has been taken`,
      );
    });
  });

  describe("addAnimalBreedingRecord", () => {
    const houses = [{ house_number: "A123" }, { house_number: "B123" }];
    const rooms = [{ room_number: "A123" }, { room_number: "B123" }];
    enum Gender {
      MALE = "MALE",
      FEMALE = "FEMALE",
    }
    const animals = [
      {
        tag_number: "BF01",
        gender: Gender.FEMALE,
        birth_date: new Date("2025-01-01T14:30:45.123Z"),
        breed: "ALBINO",
      },
      {
        tag_number: "BF02",
        gender: Gender.MALE,
        birth_date: new Date("2025-01-01T14:30:45.123Z"),
        breed: "ALBINO",
      },
    ];

    const breedingRecord = {
      matingDate: new Date("2025-02-01T14:30:45.123Z"),
      expectedDelivery: new Date("2025-03-01T14:30:45.123Z"),
      maleTagNumber: animals[1].tag_number,
      femaleTagNumber: animals[0].tag_number,
    };

    const setupEverything = async () => {
      await createAdminAccountWithFarmAndWorkers();
      const adminFarms = await getAdminFarms(adminInfo.email);

      await farmController.addHousesToFarm(
        {
          user: {
            email: adminInfo.email,
          },
        },
        {
          farmId: `${adminFarms[0].id}`,
        },
        {
          houses,
        },
      );

      await farmController.addRoomsToHouse(
        {
          user: {
            email: adminInfo.email,
          },
        },
        {
          farmId: `${adminFarms[0].id}`,
          houseNumber: houses[0].house_number,
        },
        {
          rooms,
        },
      );

      await farmController.addAnimalsToRoom(
        {
          user: {
            email: adminInfo.email,
          },
        },
        {
          farmId: `${adminFarms[0].id}`,
          houseNumber: houses[0].house_number,
          roomNumber: rooms[0].room_number,
        },
        {
          animals,
        },
      );
    };

    it("returns success message when breeding record for male and female animals is created", async () => {
      await setupEverything();

      const response = await farmController.addAnimalBreedingRecord(
        {
          user: {
            email: adminInfo.email,
            role: "ADMIN",
          },
        },
        breedingRecord,
      );

      expect(response.message).toBe(
        `Breeding records for ${animals[1].tag_number} and ${animals[0].tag_number} created successfully`,
      );

      const adminFarms = await getAdminFarms(adminInfo.email);
      expect(adminFarms[0].animals[0].breeding_records.length).toEqual(1);
    });

    it("throws an error if animals have an in_progress breeding record", async () => {
      await setupEverything();

      await farmController.addAnimalBreedingRecord(
        {
          user: {
            email: adminInfo.email,
            role: "ADMIN",
          },
        },
        breedingRecord,
      );

      await expect(
        farmController.addAnimalBreedingRecord(
          {
            user: {
              email: adminInfo.email,
              role: "ADMIN",
            },
          },
          breedingRecord,
        ),
      ).rejects.toThrow(BadRequestException);

      await expect(
        farmController.addAnimalBreedingRecord(
          {
            user: {
              email: adminInfo.email,
              role: "ADMIN",
            },
          },
          breedingRecord,
        ),
      ).rejects.toThrow(
        "These animals already have an in-progress breeding record",
      );
    });
  });

  describe("addAnimalExpenseRecord", () => {
    const houses = [{ house_number: "A123" }, { house_number: "B123" }];
    const rooms = [{ room_number: "A123" }, { room_number: "B123" }];
    enum Gender {
      MALE = "MALE",
      FEMALE = "FEMALE",
    }
    const animals = [
      {
        tag_number: "BF01",
        gender: Gender.FEMALE,
        birth_date: new Date("2025-01-01T14:30:45.123Z"),
        breed: "ALBINO",
      },
      {
        tag_number: "BF02",
        gender: Gender.MALE,
        birth_date: new Date("2025-01-01T14:30:45.123Z"),
        breed: "ALBINO",
      },
    ];

    enum Category {
      FEED = "FEED", // Individual feed costs
      MEDICAL = "MEDICAL", // Medications, treatments, individual vet care
      VACCINATION = "VACCINATION", // Routine or special vaccinations
      BREEDING = "BREEDING", // Breeding fees, artificial insemination
      IDENTIFICATION = "IDENTIFICATION", // Tags, chips, registration fees
      GROOMING = "GROOMING", // Cleaning, shearing, hoof trimming
      SUPPLEMENTS = "SUPPLEMENTS", // Vitamins, minerals, special nutrition
      TESTING = "TESTING", // Disease testing, genetic testing
      QUARANTINE = "QUARANTINE", // Isolation expenses
      TRANSPORT = "TRANSPORT", // Moving an individual animal
      SPECIAL_HOUSING = "SPECIAL_HOUSING", // Individual pens or special accommodations
      OTHER = "OTHER", // Miscellaneous individual expenses
    }

    const expenseRecord = {
      category: Category.FEED,
      expenseDate: new Date("2025-02-01T14:30:45.123Z"),
      amount: 200,
      notes: "Heyaaa",
    };

    const setupEverything = async () => {
      await createAdminAccountWithFarmAndWorkers();
      const adminFarms = await getAdminFarms(adminInfo.email);

      await farmController.addHousesToFarm(
        {
          user: {
            email: adminInfo.email,
          },
        },
        {
          farmId: `${adminFarms[0].id}`,
        },
        {
          houses,
        },
      );

      await farmController.addRoomsToHouse(
        {
          user: {
            email: adminInfo.email,
          },
        },
        {
          farmId: `${adminFarms[0].id}`,
          houseNumber: houses[0].house_number,
        },
        {
          rooms,
        },
      );

      await farmController.addAnimalsToRoom(
        {
          user: {
            email: adminInfo.email,
          },
        },
        {
          farmId: `${adminFarms[0].id}`,
          houseNumber: houses[0].house_number,
          roomNumber: rooms[0].room_number,
        },
        {
          animals,
        },
      );
    };

    it("returns success message when expense-record created successfully", async () => {
      await setupEverything();

      const response = await farmController.addAnimalExpenseRecord(
        {
          user: {
            email: adminInfo.email,
            role: "ADMIN",
          },
        },
        {
          tagNumber: animals[0].tag_number,
        },
        {
          ...expenseRecord,
        },
      );
      expect(response.message).toBe("Expense record created successfully");

      const adminFarms = await getAdminFarms(adminInfo.email);

      expect(
        adminFarms[0].animals.find(
          (anl) => anl.tag_number === animals[0].tag_number,
        ).expense_records.length,
      ).toEqual(1);
    });

    it("throws an error when animal does not belong to the farm", async () => {
      await setupEverything();

      await expect(
        farmController.addAnimalExpenseRecord(
          {
            user: {
              email: adminInfo.email,
              role: "ADMIN",
            },
          },
          {
            tagNumber: "12345",
          },
          {
            ...expenseRecord,
          },
        ),
      ).rejects.toThrow(BadRequestException);

      await expect(
        farmController.addAnimalExpenseRecord(
          {
            user: {
              email: adminInfo.email,
              role: "ADMIN",
            },
          },
          {
            tagNumber: "12345",
          },
          {
            ...expenseRecord,
          },
        ),
      ).rejects.toThrow(
        `Animal with tag ${12345} does not belong to this farm`,
      );
    });
  });

  describe("addAnimalGrowthRecord", () => {
    const houses = [{ house_number: "A123" }, { house_number: "B123" }];
    const rooms = [{ room_number: "A123" }, { room_number: "B123" }];
    enum Gender {
      MALE = "MALE",
      FEMALE = "FEMALE",
    }
    const animals = [
      {
        tag_number: "BF01",
        gender: Gender.FEMALE,
        birth_date: new Date("2025-01-01T14:30:45.123Z"),
        breed: "ALBINO",
      },
      {
        tag_number: "BF02",
        gender: Gender.MALE,
        birth_date: new Date("2025-01-01T14:30:45.123Z"),
        breed: "ALBINO",
      },
    ];

    enum Period {
      BIRTH = "BIRTH",
      "4_WEEKS" = "4_WEEKS",
      "8_WEEKS" = "8_WEEKS",
      ADULTHOOD = "ADULTHOOD",
    }

    const growthRecord = {
      period: Period.BIRTH,
      growthRate: 12,
      notes: "Heyaaa",
    };

    const setupEverything = async () => {
      await createAdminAccountWithFarmAndWorkers();
      const adminFarms = await getAdminFarms(adminInfo.email);

      await farmController.addHousesToFarm(
        {
          user: {
            email: adminInfo.email,
          },
        },
        {
          farmId: `${adminFarms[0].id}`,
        },
        {
          houses,
        },
      );

      await farmController.addRoomsToHouse(
        {
          user: {
            email: adminInfo.email,
          },
        },
        {
          farmId: `${adminFarms[0].id}`,
          houseNumber: houses[0].house_number,
        },
        {
          rooms,
        },
      );

      await farmController.addAnimalsToRoom(
        {
          user: {
            email: adminInfo.email,
          },
        },
        {
          farmId: `${adminFarms[0].id}`,
          houseNumber: houses[0].house_number,
          roomNumber: rooms[0].room_number,
        },
        {
          animals,
        },
      );
    };

    it("returns success message when growth-record created successfully", async () => {
      await setupEverything();

      const response = await farmController.addAnimalGrowthRecord(
        {
          user: {
            email: adminInfo.email,
            role: "ADMIN",
          },
        },
        {
          tagNumber: animals[0].tag_number,
        },
        {
          ...growthRecord,
        },
      );
      expect(response.message).toBe("Growth record created successfully");

      const adminFarms = await getAdminFarms(adminInfo.email);

      expect(
        adminFarms[0].animals.find(
          (anl) => anl.tag_number === animals[0].tag_number,
        ).growth_records.length,
      ).toEqual(1);
    });

    it("throws an error when animal does not belong to the farm", async () => {
      await setupEverything();

      await expect(
        farmController.addAnimalGrowthRecord(
          {
            user: {
              email: adminInfo.email,
              role: "ADMIN",
            },
          },
          {
            tagNumber: "12345",
          },
          {
            ...growthRecord,
          },
        ),
      ).rejects.toThrow(BadRequestException);

      await expect(
        farmController.addAnimalGrowthRecord(
          {
            user: {
              email: adminInfo.email,
              role: "ADMIN",
            },
          },
          {
            tagNumber: "12345",
          },
          {
            ...growthRecord,
          },
        ),
      ).rejects.toThrow(
        `Animal with tag ${12345} does not belong to this farm`,
      );
    });
  });

  describe("addAnimalHealthRecord", () => {
    const houses = [{ house_number: "A123" }, { house_number: "B123" }];
    const rooms = [{ room_number: "A123" }, { room_number: "B123" }];
    enum Gender {
      MALE = "MALE",
      FEMALE = "FEMALE",
    }
    const animals = [
      {
        tag_number: "BF01",
        gender: Gender.FEMALE,
        birth_date: new Date("2025-01-01T14:30:45.123Z"),
        breed: "ALBINO",
      },
      {
        tag_number: "BF02",
        gender: Gender.MALE,
        birth_date: new Date("2025-01-01T14:30:45.123Z"),
        breed: "ALBINO",
      },
    ];

    const healthRecord = {
      issue: "Some issues",
      symptoms: "Sleeping often",
      diagnosis: "Pain in the body",
      medication: "Paracetamol",
      vet_name: "Frederick Aziebu",
      cost: 20,
      notes: "Heyyaaa",
    };

    const setupEverything = async () => {
      await createAdminAccountWithFarmAndWorkers();
      const adminFarms = await getAdminFarms(adminInfo.email);

      await farmController.addHousesToFarm(
        {
          user: {
            email: adminInfo.email,
          },
        },
        {
          farmId: `${adminFarms[0].id}`,
        },
        {
          houses,
        },
      );

      await farmController.addRoomsToHouse(
        {
          user: {
            email: adminInfo.email,
          },
        },
        {
          farmId: `${adminFarms[0].id}`,
          houseNumber: houses[0].house_number,
        },
        {
          rooms,
        },
      );

      await farmController.addAnimalsToRoom(
        {
          user: {
            email: adminInfo.email,
          },
        },
        {
          farmId: `${adminFarms[0].id}`,
          houseNumber: houses[0].house_number,
          roomNumber: rooms[0].room_number,
        },
        {
          animals,
        },
      );
    };

    it("returns success message when health-record created successfully", async () => {
      await setupEverything();

      const response = await farmController.addAnimalHealthRecord(
        {
          user: {
            email: adminInfo.email,
            role: "ADMIN",
          },
        },
        {
          tagNumber: animals[0].tag_number,
        },
        {
          ...healthRecord,
        },
      );
      expect(response.message).toBe("Health record created successfully");

      const adminFarms = await getAdminFarms(adminInfo.email);

      expect(
        adminFarms[0].animals.find(
          (anl) => anl.tag_number === animals[0].tag_number,
        ).health_records.length,
      ).toEqual(1);
    });

    it("throws an error when animal does not belong to the farm", async () => {
      await setupEverything();

      await expect(
        farmController.addAnimalHealthRecord(
          {
            user: {
              email: adminInfo.email,
              role: "ADMIN",
            },
          },
          {
            tagNumber: "12345",
          },
          {
            ...healthRecord,
          },
        ),
      ).rejects.toThrow(BadRequestException);

      await expect(
        farmController.addAnimalHealthRecord(
          {
            user: {
              email: adminInfo.email,
              role: "ADMIN",
            },
          },
          {
            tagNumber: "12345",
          },
          {
            ...healthRecord,
          },
        ),
      ).rejects.toThrow(
        `Animal with tag ${12345} does not belong to this farm`,
      );
    });
  });

  describe("addAnimalSalesRecord", () => {
    const houses = [{ house_number: "A123" }, { house_number: "B123" }];
    const rooms = [{ room_number: "A123" }, { room_number: "B123" }];
    enum Gender {
      MALE = "MALE",
      FEMALE = "FEMALE",
    }
    const animals = [
      {
        tag_number: "BF01",
        gender: Gender.FEMALE,
        birth_date: new Date("2025-01-01T14:30:45.123Z"),
        breed: "ALBINO",
      },
      {
        tag_number: "BF02",
        gender: Gender.MALE,
        birth_date: new Date("2025-01-01T14:30:45.123Z"),
        breed: "ALBINO",
      },
    ];

    const saleRecord = {
      buyerName: "Frederick Aziebu",
      saleDate: new Date("2025-04-01T14:30:45.123Z"),
      priceSold: 20,
      notes: "Heyaaa",
    };

    const setupEverything = async () => {
      await createAdminAccountWithFarmAndWorkers();
      const adminFarms = await getAdminFarms(adminInfo.email);

      await farmController.addHousesToFarm(
        {
          user: {
            email: adminInfo.email,
          },
        },
        {
          farmId: `${adminFarms[0].id}`,
        },
        {
          houses,
        },
      );

      await farmController.addRoomsToHouse(
        {
          user: {
            email: adminInfo.email,
          },
        },
        {
          farmId: `${adminFarms[0].id}`,
          houseNumber: houses[0].house_number,
        },
        {
          rooms,
        },
      );

      await farmController.addAnimalsToRoom(
        {
          user: {
            email: adminInfo.email,
          },
        },
        {
          farmId: `${adminFarms[0].id}`,
          houseNumber: houses[0].house_number,
          roomNumber: rooms[0].room_number,
        },
        {
          animals,
        },
      );
    };

    it("returns success message when sales-record created successfully", async () => {
      await setupEverything();

      const response = await farmController.addAnimalSalesRecord(
        {
          user: {
            email: adminInfo.email,
            role: "ADMIN",
          },
        },
        {
          tagNumber: animals[0].tag_number,
        },
        {
          ...saleRecord,
        },
      );
      expect(response.message).toBe("Sale record created successfully");

      const adminFarms = await getAdminFarms(adminInfo.email);

      expect(
        adminFarms[0].animals.find(
          (anl) => anl.tag_number === animals[0].tag_number,
        ).sales_record,
      ).not.toBeUndefined();
    });

    it("throws an error when animal does not belong to the farm", async () => {
      await setupEverything();

      await expect(
        farmController.addAnimalSalesRecord(
          {
            user: {
              email: adminInfo.email,
              role: "ADMIN",
            },
          },
          {
            tagNumber: "12345",
          },
          {
            ...saleRecord,
          },
        ),
      ).rejects.toThrow(BadRequestException);

      await expect(
        farmController.addAnimalSalesRecord(
          {
            user: {
              email: adminInfo.email,
              role: "ADMIN",
            },
          },
          {
            tagNumber: "12345",
          },
          {
            ...saleRecord,
          },
        ),
      ).rejects.toThrow(
        `Animal with tag ${12345} does not belong to this farm`,
      );
    });
  });
});
