import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  Admin,
  ExpenseRecord,
  Farm,
  Field,
  CropBatch,
  SalesRecord,
  Worker,
  Greenhouse,
} from "../../../database/entities";
import {
  CropBatchFilterInput,
  CropBatchInput,
  CropBatchSortInput,
  ExpenseRecordInput,
  FieldInput,
  FieldSortInput,
  GreenhouseInput,
  GreenhouseSortInput,
  SalesRecordInput,
  UpdateCropBatchInput,
  UpdateExpenseRecordInput,
  UpdateFieldInput,
  UpdateGreenhouseInput,
  UpdateSalesRecordInput,
} from "../inputs";
import { ILike, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { v4 as uuidv4 } from "uuid";
import { ProductType } from "../../../database/types/sales-record.type";
import { PaginationInput } from "src/database/inputs";

@Injectable()
export class CropService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(Worker)
    private workerRepository: Repository<Worker>,
    @InjectRepository(Farm)
    private farmRepository: Repository<Farm>,
    @InjectRepository(CropBatch)
    private cropBatchRepository: Repository<CropBatch>,
    @InjectRepository(Field)
    private fieldRepository: Repository<Field>,
    @InjectRepository(Greenhouse)
    private greenhouseRepository: Repository<Greenhouse>,
    @InjectRepository(ExpenseRecord)
    private expenseRecordRepository: Repository<ExpenseRecord>,
    @InjectRepository(SalesRecord)
    private salesRecordRepository: Repository<SalesRecord>,
  ) {}

  async addFieldsToFarm({
    farmTag,
    email,
    fields,
    role,
  }: {
    farmTag: string;
    email: string;
    fields: Array<FieldInput>;
    role: "ADMIN" | "WORKER";
  }) {
    return this.farmRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const farm = await transactionalEntityManager.findOne(Farm, {
          where: {
            farm_tag: farmTag,
            [role === "ADMIN" ? "admin" : "workers"]: {
              email,
            },
          },
          relations: ["fields"],
        });

        if (!farm) {
          throw new NotFoundException("Farm not found");
        }

        const new_fields: Field[] = await Promise.all(
          fields.map(async (field) => {
            const existingField = await transactionalEntityManager.findOne(
              Field,
              {
                where: {
                  unit_id: field.unitId,
                },
              },
            );

            if (existingField) {
              throw new BadRequestException(
                `A field with unit_id ${field.unitId} already exist`,
              );
            }

            const new_field = new Field();
            new_field.unit_id = field.unitId;
            new_field.name = field.name;
            new_field.capacity = field.capacity;
            new_field.area_hectares = field.areaHectares;
            new_field.soil_type = field.soilType || null;
            new_field.irrigation_type = field.irrigationType || null;
            new_field.slope = field.slope || null;
            new_field.drainage = field.drainage || null;
            new_field.soil_test_results = field.soilTestResults || null;

            return new_field;
          }),
        );

        const saved_fields = await transactionalEntityManager.save(new_fields);

        farm.fields.push(...saved_fields);

        return await transactionalEntityManager.save(Farm, farm);
      },
    );
  }

  async addGreenhousesToFarm({
    farmTag,
    email,
    greenhouses,
    role,
  }: {
    farmTag: string;
    email: string;
    greenhouses: Array<GreenhouseInput>;
    role: "ADMIN" | "WORKER";
  }) {
    return this.farmRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const farm = await transactionalEntityManager.findOne(Farm, {
          where: {
            farm_tag: farmTag,
            [role === "ADMIN" ? "admin" : "workers"]: {
              email,
            },
          },
          relations: ["greenhouses"],
        });

        if (!farm) {
          throw new NotFoundException("Farm not found");
        }

        const new_greenhouses: Greenhouse[] = await Promise.all(
          greenhouses.map(async (greenhouse) => {
            const existingGreenhouse = await transactionalEntityManager.findOne(
              Greenhouse,
              {
                where: {
                  unit_id: greenhouse.unitId,
                },
              },
            );

            if (existingGreenhouse) {
              throw new BadRequestException(
                `A greenhouse with unit_id ${greenhouse.unitId} already exist`,
              );
            }

            const new_greenhouse = new Greenhouse();
            new_greenhouse.unit_id = greenhouse.unitId;
            new_greenhouse.name = greenhouse.name;
            new_greenhouse.capacity = greenhouse.capacity;
            new_greenhouse.area_sqm = greenhouse.areaSqm;
            new_greenhouse.construction_date =
              greenhouse.constructionDate || null;
            new_greenhouse.covering_material =
              greenhouse.coveringMaterial || null;
            new_greenhouse.temperature_control =
              greenhouse.temperatureControl || null;
            new_greenhouse.lighting_system = greenhouse.lightingSystem || null;
            new_greenhouse.irrigation_system =
              greenhouse.irrigationSystem || null;
            new_greenhouse.climate_controlled =
              greenhouse.climateControlled || false;
            new_greenhouse.ventilation_system =
              greenhouse.ventilationSystem || null;

            return new_greenhouse;
          }),
        );

        const saved_greenhouses =
          await transactionalEntityManager.save(new_greenhouses);

        farm.greenhouses.push(...saved_greenhouses);

        return await transactionalEntityManager.save(Farm, farm);
      },
    );
  }

  async addCropBatchesToField({
    email,
    fieldUnitId,
    cropBatches,
    role,
  }: {
    email: string;
    fieldUnitId: string;
    cropBatches: Array<CropBatchInput>;
    role: "ADMIN" | "WORKER";
  }) {
    return this.fieldRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const field = await transactionalEntityManager.findOne(Field, {
          where: {
            unit_id: fieldUnitId,
            farm: {
              [role === "ADMIN" ? "admin" : "workers"]: {
                email,
              },
            },
          },
          relations: ["crop_batches", "farm.crop_batches"],
        });

        if (!field) {
          throw new NotFoundException("Field not found");
        }

        const new_crop_batches: CropBatch[] = await Promise.all(
          cropBatches.map(async (cropBatch) => {
            const new_crop_batch = new CropBatch();
            new_crop_batch.crop_batch_tag = uuidv4();
            new_crop_batch.name = cropBatch.name;
            new_crop_batch.crop_type = cropBatch.cropType;
            new_crop_batch.crop_kind = cropBatch.cropKind;
            new_crop_batch.variety = cropBatch.variety;
            new_crop_batch.planting_date = cropBatch.plantingDate;
            new_crop_batch.harvest_date = cropBatch.harvestDate || null;
            new_crop_batch.planting_method =
              cropBatch.plantingMethod || new_crop_batch.planting_method;
            new_crop_batch.irrigation_method =
              cropBatch.irrigationMethod || new_crop_batch.irrigation_method;
            new_crop_batch.area_planted =
              cropBatch.areaPlanted || new_crop_batch.area_planted;
            new_crop_batch.area_unit =
              cropBatch.areaUnit || new_crop_batch.area_unit;
            new_crop_batch.gps_coordinates = cropBatch.gpsCoordinates || null;
            new_crop_batch.plants_count = cropBatch.plantsCount;

            return new_crop_batch;
          }),
        );

        const saved_crop_batches =
          await transactionalEntityManager.save(new_crop_batches);

        field.crop_batches.push(...saved_crop_batches);
        field.farm.crop_batches.push(...saved_crop_batches);

        await transactionalEntityManager.save(Farm, field.farm);
        return await transactionalEntityManager.save(Field, field);
      },
    );
  }

  async addCropBatchesToGreenhouse({
    email,
    greenhouseUnitId,
    cropBatches,
    role,
  }: {
    email: string;
    greenhouseUnitId: string;
    cropBatches: Array<CropBatchInput>;
    role: "ADMIN" | "WORKER";
  }) {
    return this.fieldRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const greenhouse = await transactionalEntityManager.findOne(
          Greenhouse,
          {
            where: {
              unit_id: greenhouseUnitId,
              farm: {
                [role === "ADMIN" ? "admin" : "workers"]: {
                  email,
                },
              },
            },
            relations: ["crop_batches", "farm.crop_batches"],
          },
        );

        if (!greenhouse) {
          throw new NotFoundException("Greenhouse not found");
        }

        const new_crop_batches: CropBatch[] = await Promise.all(
          cropBatches.map(async (cropBatch) => {
            const new_crop_batch = new CropBatch();
            new_crop_batch.crop_batch_tag = uuidv4();
            new_crop_batch.name = cropBatch.name;
            new_crop_batch.crop_type = cropBatch.cropType;
            new_crop_batch.crop_kind = cropBatch.cropKind;
            new_crop_batch.variety = cropBatch.variety;
            new_crop_batch.planting_date = cropBatch.plantingDate;
            new_crop_batch.harvest_date = cropBatch.harvestDate || null;
            new_crop_batch.planting_method =
              cropBatch.plantingMethod || new_crop_batch.planting_method;
            new_crop_batch.irrigation_method =
              cropBatch.irrigationMethod || new_crop_batch.irrigation_method;
            new_crop_batch.area_planted =
              cropBatch.areaPlanted || new_crop_batch.area_planted;
            new_crop_batch.area_unit =
              cropBatch.areaUnit || new_crop_batch.area_unit;
            new_crop_batch.plants_count = cropBatch.plantsCount;

            return new_crop_batch;
          }),
        );

        const saved_crop_batches =
          await transactionalEntityManager.save(new_crop_batches);

        greenhouse.crop_batches.push(...saved_crop_batches);
        greenhouse.farm.crop_batches.push(...saved_crop_batches);

        await transactionalEntityManager.save(Farm, greenhouse.farm);
        return await transactionalEntityManager.save(Greenhouse, greenhouse);
      },
    );
  }

  async addCropBatchExpenseRecord({
    email,
    cropBatchTag,
    expenseRecord,
    role,
  }: {
    email: string;
    cropBatchTag: string;
    expenseRecord: ExpenseRecordInput;
    role: "ADMIN" | "WORKER";
  }) {
    return this.expenseRecordRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const cropBatch = await transactionalEntityManager.findOne(CropBatch, {
          where: {
            crop_batch_tag: cropBatchTag,
            farm: {
              [role === "ADMIN" ? "admin" : "workers"]: {
                email,
              },
            },
          },
          relations: ["expense_records"],
        });

        if (!cropBatch) {
          throw new NotFoundException("Crop batch not found");
        }

        const newExpenseRecord = new ExpenseRecord();
        newExpenseRecord.amount = expenseRecord.amount;
        newExpenseRecord.expense_date = expenseRecord.expenseDate;
        newExpenseRecord.category = expenseRecord.category;
        newExpenseRecord.notes = expenseRecord.notes;
        newExpenseRecord.crop_batch = cropBatch;

        const savedExpenseRecord = await transactionalEntityManager.save(
          ExpenseRecord,
          newExpenseRecord,
        );

        cropBatch.expense_records.push(savedExpenseRecord);

        await transactionalEntityManager.save(CropBatch, cropBatch);

        return savedExpenseRecord;
      },
    );
  }

  async addCropBatchSalesRecord({
    email,
    cropBatchTag,
    salesRecord,
    role,
  }: {
    email: string;
    cropBatchTag: string;
    salesRecord: SalesRecordInput;
    role: "ADMIN" | "WORKER";
  }) {
    return this.salesRecordRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const cropBatch = await transactionalEntityManager.findOne(CropBatch, {
          where: {
            crop_batch_tag: cropBatchTag,
            farm: {
              [role === "ADMIN" ? "admin" : "workers"]: {
                email,
              },
            },
          },
          relations: ["sales_records"],
        });

        if (!cropBatch) {
          throw new NotFoundException("Crop batch not found");
        }

        const newSalesRecord = new SalesRecord();
        newSalesRecord.buyer_name = salesRecord.buyerName;
        newSalesRecord.expenses =
          salesRecord.expenses || newSalesRecord.expenses;
        newSalesRecord.notes = salesRecord.notes;
        newSalesRecord.price_per_unit = salesRecord.pricePerUnit;
        newSalesRecord.quantity = salesRecord.quantity;
        newSalesRecord.sale_date = salesRecord.saleDate;
        newSalesRecord.total_amount = salesRecord.totalAmount;
        newSalesRecord.unit = salesRecord.unit;
        newSalesRecord.product_type = ProductType.CROP;
        newSalesRecord.crop_batch = cropBatch;

        const savedSalesRecord = await transactionalEntityManager.save(
          SalesRecord,
          newSalesRecord,
        );

        cropBatch.sales_records.push(savedSalesRecord);

        await transactionalEntityManager.save(CropBatch, cropBatch);

        return savedSalesRecord;
      },
    );
  }

  async updateField({
    email,
    fieldUnitId,
    field,
    role,
  }: {
    email: string;
    fieldUnitId: string;
    field: UpdateFieldInput;
    role: "ADMIN" | "WORKER";
  }) {
    return this.fieldRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const fieldToUpdate = await transactionalEntityManager.findOne(Field, {
          where: {
            unit_id: fieldUnitId,
            farm: {
              [role === "ADMIN" ? "admin" : "workers"]: {
                email,
              },
            },
          },
        });

        if (!fieldToUpdate) {
          throw new NotFoundException("Field not found");
        }

        fieldToUpdate.name = field.name || fieldToUpdate.name;
        fieldToUpdate.capacity = field.capacity || fieldToUpdate.capacity;
        fieldToUpdate.area_hectares =
          field.areaHectares || fieldToUpdate.area_hectares;
        fieldToUpdate.soil_type = field.soilType || fieldToUpdate.soil_type;
        fieldToUpdate.irrigation_type =
          field.irrigationType || fieldToUpdate.irrigation_type;
        fieldToUpdate.slope = field.slope || fieldToUpdate.slope;
        fieldToUpdate.drainage = field.drainage || fieldToUpdate.drainage;
        fieldToUpdate.soil_test_results =
          field.soilTestResults || fieldToUpdate.soil_test_results;
        fieldToUpdate.previous_crop =
          field.previousCrop || fieldToUpdate.previous_crop;
        fieldToUpdate.status = field.status || fieldToUpdate.status;

        const savedField = await transactionalEntityManager.save(
          Field,
          fieldToUpdate,
        );

        return savedField;
      },
    );
  }

  async updateGreenhouse({
    email,
    greenhouseUnitId,
    greenhouse,
    role,
  }: {
    email: string;
    greenhouseUnitId: string;
    greenhouse: UpdateGreenhouseInput;
    role: "ADMIN" | "WORKER";
  }) {
    return this.greenhouseRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const greenhouseToUpdate = await transactionalEntityManager.findOne(
          Greenhouse,
          {
            where: {
              unit_id: greenhouseUnitId,
              farm: {
                [role === "ADMIN" ? "admin" : "workers"]: {
                  email,
                },
              },
            },
          },
        );

        if (!greenhouseToUpdate) {
          throw new NotFoundException("Greenhouse not found");
        }

        greenhouseToUpdate.name = greenhouse.name || greenhouseToUpdate.name;
        greenhouseToUpdate.capacity =
          greenhouse.capacity || greenhouseToUpdate.capacity;
        greenhouseToUpdate.area_sqm =
          greenhouse.areaSqm || greenhouseToUpdate.area_sqm;
        greenhouseToUpdate.construction_date =
          greenhouse.constructionDate || greenhouseToUpdate.construction_date;
        greenhouseToUpdate.covering_material =
          greenhouse.coveringMaterial || greenhouseToUpdate.covering_material;
        greenhouseToUpdate.temperature_control =
          greenhouse.temperatureControl ||
          greenhouseToUpdate.temperature_control;
        greenhouseToUpdate.lighting_system =
          greenhouse.lightingSystem || greenhouseToUpdate.lighting_system;
        greenhouseToUpdate.irrigation_system =
          greenhouse.irrigationSystem || greenhouseToUpdate.irrigation_system;
        greenhouseToUpdate.climate_controlled =
          greenhouse.climateControlled || greenhouseToUpdate.climate_controlled;
        greenhouseToUpdate.ventilation_system =
          greenhouse.ventilationSystem || greenhouseToUpdate.ventilation_system;
        greenhouseToUpdate.status =
          greenhouse.status || greenhouseToUpdate.status;

        const savedGreenhouse = await transactionalEntityManager.save(
          Greenhouse,
          greenhouseToUpdate,
        );

        return savedGreenhouse;
      },
    );
  }

  async updateCropBatch({
    email,
    cropBatchTag,
    cropBatch,
    role,
  }: {
    email: string;
    cropBatchTag: string;
    cropBatch: UpdateCropBatchInput;
    role: "ADMIN" | "WORKER";
  }) {
    return this.cropBatchRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const cropBatchToUpdate = await transactionalEntityManager.findOne(
          CropBatch,
          {
            where: {
              crop_batch_tag: cropBatchTag,
              farm: {
                [role === "ADMIN" ? "admin" : "workers"]: {
                  email,
                },
              },
            },
          },
        );

        if (!cropBatchToUpdate) {
          throw new NotFoundException("Crop batch not found");
        }

        cropBatchToUpdate.name = cropBatch.name || cropBatchToUpdate.name;
        cropBatchToUpdate.crop_type =
          cropBatch.cropType || cropBatchToUpdate.crop_type;
        cropBatchToUpdate.variety =
          cropBatch.variety || cropBatchToUpdate.variety;
        cropBatchToUpdate.planting_date =
          cropBatch.plantingDate || cropBatchToUpdate.planting_date;
        cropBatchToUpdate.harvest_date =
          cropBatch.harvestDate || cropBatchToUpdate.harvest_date;
        cropBatchToUpdate.planting_method =
          cropBatch.plantingMethod || cropBatchToUpdate.planting_method;
        cropBatchToUpdate.irrigation_method =
          cropBatch.irrigationMethod || cropBatchToUpdate.irrigation_method;
        cropBatchToUpdate.area_planted =
          cropBatch.areaPlanted || cropBatchToUpdate.area_planted;
        cropBatchToUpdate.area_unit =
          cropBatch.areaUnit || cropBatchToUpdate.area_unit;
        cropBatchToUpdate.plants_count =
          cropBatch.plantsCount || cropBatchToUpdate.plants_count;
        cropBatchToUpdate.seed_amount =
          cropBatch.seedAmount || cropBatchToUpdate.seed_amount;
        cropBatchToUpdate.seed_unit =
          cropBatch.seedUnit || cropBatchToUpdate.seed_unit;
        cropBatchToUpdate.expected_yield =
          cropBatch.expectedYield || cropBatchToUpdate.expected_yield;
        cropBatchToUpdate.actual_yield =
          cropBatch.actualYield || cropBatchToUpdate.actual_yield;
        cropBatchToUpdate.yield_unit =
          cropBatch.yieldUnit || cropBatchToUpdate.yield_unit;
        cropBatchToUpdate.fertilizer_applications =
          cropBatch.fertilizerApplications ||
          cropBatchToUpdate.fertilizer_applications;
        cropBatchToUpdate.pesticide_applications =
          cropBatch.pesticideApplications ||
          cropBatchToUpdate.pesticide_applications;
        cropBatchToUpdate.weather_conditions =
          cropBatch.weatherConditions || cropBatchToUpdate.weather_conditions;
        cropBatchToUpdate.gps_coordinates =
          cropBatch.gpsCoordinates || cropBatchToUpdate.gps_coordinates;
        cropBatchToUpdate.status = cropBatch.status || cropBatchToUpdate.status;

        const savedCropBatch = await transactionalEntityManager.save(
          CropBatch,
          cropBatchToUpdate,
        );

        return savedCropBatch;
      },
    );
  }

  async updateCropBatchExpenseRecord({
    email,
    expenseRecordId,
    expenseRecord,
    role,
  }: {
    email: string;
    expenseRecordId: number;
    expenseRecord: UpdateExpenseRecordInput;
    role: "ADMIN" | "WORKER";
  }) {
    return this.expenseRecordRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const expenseRecordToUpdate = await transactionalEntityManager.findOne(
          ExpenseRecord,
          {
            where: {
              id: expenseRecordId,
              crop_batch: {
                farm: { [role === "ADMIN" ? "admin" : "workers"]: { email } },
              },
            },
          },
        );

        if (!expenseRecordToUpdate) {
          throw new NotFoundException("Expense record not found");
        }

        expenseRecordToUpdate.amount =
          expenseRecord.amount || expenseRecordToUpdate.amount;
        expenseRecordToUpdate.expense_date =
          expenseRecord.expenseDate || expenseRecordToUpdate.expense_date;
        expenseRecordToUpdate.category =
          expenseRecord.category || expenseRecordToUpdate.category;
        expenseRecordToUpdate.notes =
          expenseRecord.notes || expenseRecordToUpdate.notes;

        const savedExpenseRecord = await transactionalEntityManager.save(
          ExpenseRecord,
          expenseRecordToUpdate,
        );

        return savedExpenseRecord;
      },
    );
  }

  async updateCropBatchSalesRecord({
    email,
    salesRecordId,
    salesRecord,
    role,
  }: {
    email: string;
    salesRecordId: number;
    salesRecord: UpdateSalesRecordInput;
    role: "ADMIN" | "WORKER";
  }) {
    return this.salesRecordRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const salesRecordToUpdate = await transactionalEntityManager.findOne(
          SalesRecord,
          {
            where: {
              id: salesRecordId,
              crop_batch: {
                farm: { [role === "ADMIN" ? "admin" : "workers"]: { email } },
              },
            },
          },
        );

        if (!salesRecordToUpdate) {
          throw new NotFoundException("Sales record not found");
        }

        salesRecordToUpdate.buyer_name =
          salesRecord.buyerName || salesRecordToUpdate.buyer_name;
        salesRecordToUpdate.expenses =
          salesRecord.expenses || salesRecordToUpdate.expenses;
        salesRecordToUpdate.notes =
          salesRecord.notes || salesRecordToUpdate.notes;
        salesRecordToUpdate.price_per_unit =
          salesRecord.pricePerUnit || salesRecordToUpdate.price_per_unit;
        salesRecordToUpdate.quantity =
          salesRecord.quantity || salesRecordToUpdate.quantity;
        salesRecordToUpdate.sale_date =
          salesRecord.saleDate || salesRecordToUpdate.sale_date;
        salesRecordToUpdate.total_amount =
          salesRecord.totalAmount || salesRecordToUpdate.total_amount;
        salesRecordToUpdate.unit = salesRecord.unit || salesRecordToUpdate.unit;

        const savedSalesRecord = await transactionalEntityManager.save(
          SalesRecord,
          salesRecordToUpdate,
        );

        return savedSalesRecord;
      },
    );
  }

  async getField({
    email,
    fieldUnitId,
    role,
  }: {
    email: string;
    fieldUnitId: string;
    role: "ADMIN" | "WORKER";
  }) {
    return this.fieldRepository.findOne({
      where: {
        farm: {
          [role === "ADMIN" ? "admin" : "workers"]: {
            email,
          },
        },
        unit_id: fieldUnitId,
      },
      relations: ["crop_batches"],
    });
  }

  async getGreenhouse({
    email,
    greenhouseUnitId,
    role,
  }: {
    email: string;
    greenhouseUnitId: string;
    role: "ADMIN" | "WORKER";
  }) {
    return this.greenhouseRepository.findOne({
      where: {
        farm: {
          [role === "ADMIN" ? "admin" : "workers"]: {
            email,
          },
        },
        unit_id: greenhouseUnitId,
      },
      relations: ["crop_batches"],
    });
  }

  async getCropBatch({
    email,
    cropBatchTag,
    role,
    housingUnit,
  }: {
    email: string;
    cropBatchTag: string;
    housingUnit: "FIELD" | "GREENHOUSE";
    role: "ADMIN" | "WORKER";
  }) {
    return this.cropBatchRepository.findOne({
      where: {
        crop_batch_tag: cropBatchTag,
        [`${housingUnit.toLowerCase()}`]: {
          farm: {
            [role === "ADMIN" ? "admin" : "workers"]: {
              email,
            },
          },
        },
      },
      relations: [
        `${housingUnit.toLowerCase()}`,
        "expense_records",
        "sales_records",
        "farm.admin",
      ],
    });
  }

  async listFields({
    email,
    searchTerm,
    sort,
    role,
  }: {
    email: string;
    searchTerm: string;
    sort?: FieldSortInput[];
    role: "ADMIN" | "WORKER";
  }) {
    const sortOrder = {};
    sort?.map((item) => {
      sortOrder[item.field] = item.direction;
    });

    return this.fieldRepository.find({
      where: {
        farm: {
          [role === "ADMIN" ? "admin" : "workers"]: {
            email,
          },
        },
        name: ILike(`%${searchTerm}%`),
      },
      relations: ["crop_batches"],
      order: sortOrder,
    });
  }

  async listFieldsPaginated({
    email,
    searchTerm,
    pagination,
    sort,
    role,
  }: {
    email: string;
    searchTerm?: string;
    pagination: PaginationInput;
    sort?: FieldSortInput[];
    role: "ADMIN" | "WORKER";
  }) {
    const fields = await this.listFields({ email, searchTerm, sort, role });
    // Apply pagination and return in the connection format
    return this.paginate<Field>(fields, pagination, (field) =>
      field.id.toString(),
    );
  }

  async listGreenhouses({
    email,
    searchTerm,
    sort,
    role,
  }: {
    email: string;
    searchTerm: string;
    sort?: GreenhouseSortInput[];
    role: "ADMIN" | "WORKER";
  }) {
    const sortOrder = {};
    sort?.map((item) => {
      sortOrder[item.field] = item.direction;
    });

    return this.greenhouseRepository.find({
      where: {
        farm: {
          [role === "ADMIN" ? "admin" : "workers"]: {
            email,
          },
        },
        name: ILike(`%${searchTerm}%`),
      },
      relations: ["crop_batches"],
      order: sortOrder,
    });
  }

  async listGreenhousesPaginated({
    email,
    searchTerm,
    pagination,
    sort,
    role,
  }: {
    email: string;
    searchTerm?: string;
    pagination: PaginationInput;
    sort?: GreenhouseSortInput[];
    role: "ADMIN" | "WORKER";
  }) {
    const greenhouses = await this.listGreenhouses({
      email,
      searchTerm,
      sort,
      role,
    });
    // Apply pagination and return in the connection format
    return this.paginate<Greenhouse>(greenhouses, pagination, (greenhouse) =>
      greenhouse.id.toString(),
    );
  }

  async listCropBatches({
    email,
    searchTerm,
    filter,
    housingUnit,
    sort,
    role,
  }: {
    email: string;
    searchTerm: string;
    filter?: CropBatchFilterInput;
    housingUnit: "FIELD" | "GREENHOUSE";
    sort?: CropBatchSortInput[];
    role: "ADMIN" | "WORKER";
  }) {
    const sortOrder = {};
    sort?.map((item) => {
      sortOrder[item.field] = item.direction;
    });

    return this.cropBatchRepository.find({
      where: {
        [`${housingUnit.toLowerCase()}`]: {
          farm: {
            [role === "ADMIN" ? "admin" : "workers"]: {
              email,
            },
          },
        },
        name: ILike(`%${searchTerm}%`),
        crop_type: filter?.crop_type,
      },
      relations: [`${housingUnit.toLowerCase()}`],
      order: sortOrder,
    });
  }

  async listCropBatchesPaginated({
    email,
    searchTerm,
    housingUnit,
    filter,
    pagination,
    sort,
    role,
  }: {
    email: string;
    searchTerm?: string;
    housingUnit: "FIELD" | "GREENHOUSE";
    filter?: CropBatchFilterInput;
    pagination: PaginationInput;
    sort?: CropBatchSortInput[];
    role: "ADMIN" | "WORKER";
  }) {
    const cropBatches = await this.listCropBatches({
      email,
      searchTerm,
      housingUnit,
      filter,
      sort,
      role,
    });
    // Apply pagination and return in the connection format
    return this.paginate<CropBatch>(cropBatches, pagination, (cropBatch) =>
      cropBatch.id.toString(),
    );
  }

  private paginate<T>(
    items: T[],
    paginationInput: PaginationInput = {},
    cursorExtractor: (item: T) => string | number,
  ) {
    const { first, after, last, before } = paginationInput;

    // Default values
    const defaultFirst = 10;
    let limit = first || defaultFirst;
    let afterIndex = -1;
    let beforeIndex = items.length;

    // Determine indices based on cursors
    if (after) {
      const decodedCursor = this.decodeCursor(after);
      afterIndex = items.findIndex(
        (item) => String(cursorExtractor(item)) === decodedCursor,
      );
      if (afterIndex === -1)
        afterIndex = -1; // Not found
      else afterIndex = afterIndex; // Include items after this index
    }

    if (before) {
      const decodedCursor = this.decodeCursor(before);
      beforeIndex = items.findIndex(
        (item) => String(cursorExtractor(item)) === decodedCursor,
      );
      if (beforeIndex === -1)
        beforeIndex = items.length; // Not found
      else beforeIndex = beforeIndex; // Include items before this index
    }

    // Handle the 'last' parameter by adjusting the starting point
    if (last) {
      const potentialCount = beforeIndex - afterIndex - 1;
      if (potentialCount > last) {
        afterIndex = beforeIndex - last - 1;
      }
      limit = last;
    }

    // Get the paginated items
    const slicedItems = items.slice(afterIndex + 1, beforeIndex);
    const paginatedItems = slicedItems.slice(0, limit);

    // Create edges with cursors
    const edges = paginatedItems.map((item) => ({
      cursor: this.encodeCursor(String(cursorExtractor(item))),
      node: item,
    }));

    // Determine if there are more pages
    const hasNextPage = beforeIndex > afterIndex + 1 + paginatedItems.length;
    const hasPreviousPage = afterIndex >= 0;

    // Create the pageInfo object
    const pageInfo = {
      hasNextPage,
      hasPreviousPage,
      startCursor: edges.length > 0 ? edges[0].cursor : null,
      endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
    };

    return {
      edges,
      pageInfo,
      count: items.length,
    };
  }

  /**
   * Encode a cursor to Base64
   */
  private encodeCursor(cursor: string): string {
    return Buffer.from(cursor).toString("base64");
  }

  /**
   * Decode a cursor from Base64
   */
  private decodeCursor(cursor: string): string {
    return Buffer.from(cursor, "base64").toString("utf-8");
  }
}
