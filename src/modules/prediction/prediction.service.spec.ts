import { Test, TestingModule } from "@nestjs/testing";
import { Connection, Repository } from "typeorm";

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
} from "../../database/entities";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { HashHelper } from "../../helpers";
import { WorkerRole } from "../../database/types/worker.type";
import { PredictionService } from "./prediction.service";
import {
  ModelType,
  PredictionCropType,
} from "../../database/types/prediction.type";
import { DiseaseType } from "../../database/types/leaf-detection.type";

describe("PredictionService", () => {
  let module: TestingModule;
  let connection: Connection;
  let predictionService: PredictionService;
  let adminRepository: Repository<Admin>;
  let farmRepository: Repository<Farm>;
  let workerRepository: Repository<Worker>;
  let predictionRepository: Repository<Prediction>;

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
              LeafDetection,
            ],
            synchronize: true,
            // dropSchema: true,
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
      providers: [PredictionService],
    }).compile();

    connection = module.get<Connection>(Connection);
    predictionService = module.get<PredictionService>(PredictionService);
    farmRepository = module.get<Repository<Farm>>(getRepositoryToken(Farm));
    adminRepository = module.get<Repository<Admin>>(getRepositoryToken(Admin));
    workerRepository = module.get<Repository<Worker>>(
      getRepositoryToken(Worker),
    );
    predictionRepository = module.get<Repository<Prediction>>(
      getRepositoryToken(Prediction),
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
  });

  afterAll(async () => {
    await connection.close();
    await module.close();
  });

  describe("submitPredictionFeedback", () => {
    it("returns prediction with feedback after successful", async () => {
      await createFarmSetup({
        name: adminInfo.name,
        adminEmail: adminInfo.email,
      });

      let admin = await getAdmin(adminInfo.email);
      let prediction = admin.farms[0].predictions[0];

      // admins
      await predictionService.submitPredictionFeedback({
        email: adminInfo.email,
        role: "ADMIN",
        predictionId: prediction.id,
        userFeedback: "Hey",
        actualDisease: DiseaseType.ANTHRACNOSE,
      });

      admin = await getAdmin(adminInfo.email);
      prediction = admin.farms[0].predictions[0];

      expect(prediction.feedback).not.toBeNull();
      expect(prediction.feedback.user_feedback).toBe("Hey");
      expect(prediction.feedback.actual_disease).toEqual(
        DiseaseType.ANTHRACNOSE,
      );

      // workers
      await predictionService.submitPredictionFeedback({
        email: adminInfo.workers[0].email,
        role: "WORKER",
        predictionId: prediction.id,
        userFeedback: "Heyaa",
        actualDisease: DiseaseType["BROWN SPOT"],
      });

      admin = await getAdmin(adminInfo.email);
      prediction = admin.farms[0].predictions[0];

      expect(prediction.feedback).not.toBeNull();
      expect(prediction.feedback.user_feedback).toBe("Heyaa");
      expect(prediction.feedback.actual_disease).toEqual(
        DiseaseType["BROWN SPOT"],
      );
    });
  });

  describe("createPrediction", () => {
    it("returns created prediction after successful", async () => {
      await createFarmSetup({
        name: adminInfo.name,
        adminEmail: adminInfo.email,
      });

      let admin = await getAdmin(adminInfo.email);
      const prediction = await predictionService.createPrediction({
        email: adminInfo.email,
        farmTag: admin.farms[0].farm_tag,
        role: "ADMIN",
        cropType: PredictionCropType.CASSAVA,
        modelUsed: ModelType.RESNET50,
        leafDetections: [
          {
            bbox: [0, 1, 2],
            detection_confidence: 9,
            confidence: 8,
            predicted_disease: DiseaseType.ANTHRACNOSE,
            top3_predictions: [DiseaseType.ANTHRACNOSE],
          },
        ],
        imagePath: "/image.png",
        processingTimeMs: 300,
      });

      expect(prediction.leaf_detections.length).toEqual(1);
    });
  });

  describe("listPredictions", () => {
    it("should return a list of prediction", async () => {
      await createFarmSetup({
        name: adminInfo.name,
        adminEmail: adminInfo.email,
      });

      const predictions = await predictionService.listPredictions({
        email: adminInfo.email,
        role: "ADMIN",
      });

      expect(predictions.length).toEqual(1);
    });
  });

  describe("getPrediction", () => {
    it("should return a particular prediction with the specified id", async () => {
      await createFarmSetup({
        name: adminInfo.name,
        adminEmail: adminInfo.email,
      });

      const admin = await getAdmin(adminInfo.email);
      const predictions = admin.farms[0].predictions[0];

      const prediction = await predictionService.getPrediction({
        email: adminInfo.email,
        role: "ADMIN",
        predictionId: predictions.id,
      });

      expect(prediction.id).toEqual(predictions.id);
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
      relations: ["workers", "farms.predictions.feedback", "farms.workers"],
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

  const createFarmSetup = async ({ name, adminEmail }) => {
    const admin = await registerAdmin({
      ...adminInfo,
      email: adminEmail,
    });

    const farm = new Farm();

    farm.name = name;
    const savedFarm = await farmRepository.save(farm);

    const workers: Worker[] = await Promise.all(
      adminInfo.workers.map(async (worker) => {
        const new_worker = new Worker();
        new_worker.name = worker.name;
        new_worker.email = worker.email;
        new_worker.roles = [WorkerRole.ANIMAL_CARETAKER];
        new_worker.password = await HashHelper.encrypt("123");
        new_worker.farms = [savedFarm];
        new_worker.admins = [admin];

        return new_worker;
      }),
    );

    await workerRepository.save(workers);

    const new_leaf_detection = new LeafDetection();
    new_leaf_detection.bbox = [0, 1, 2];
    new_leaf_detection.detection_confidence = 9;
    new_leaf_detection.predicted_disease = DiseaseType.ANTHRACNOSE;
    new_leaf_detection.confidence = 8;
    new_leaf_detection.top3_predictions = [DiseaseType.ANTHRACNOSE];

    const prediction = new Prediction();
    prediction.crop_type = PredictionCropType.CASSAVA;
    prediction.model_used = ModelType.RESNET50;
    prediction.leaf_detections = [new_leaf_detection];
    prediction.image_path = "/image.png";
    prediction.processing_time_ms = 300;
    prediction.farm = savedFarm;

    await predictionRepository.save(prediction);

    if (!admin.farms) {
      admin.farms = [];
    }

    admin.farms.push(savedFarm);
    await adminRepository.save(admin);

    return await farmRepository.save(farm);
  };
});
