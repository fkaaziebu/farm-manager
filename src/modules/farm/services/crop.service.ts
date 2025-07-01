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
  CropBatchInput,
  ExpenseRecordInput,
  FieldInput,
  GreenhouseInput,
  SalesRecordInput,
  UpdateCropBatchInput,
  UpdateExpenseRecordInput,
  UpdateFieldInput,
  UpdateGreenhouseInput,
  UpdateSalesRecordInput,
} from "../inputs";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { v4 as uuidv4 } from "uuid";
import { ProductType } from "../../../database/types/sales-record.type";

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
            new_field.gps_coordinates = field.gpsCoordinates || null;

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
            const existingCropBatch = await transactionalEntityManager.findOne(
              CropBatch,
              {
                where: {
                  crop_batch_tag: cropBatch.cropBatchTag,
                },
              },
            );

            if (existingCropBatch) {
              throw new BadRequestException(
                `A crop batch with crop batch tag ${cropBatch.cropBatchTag} already exist`,
              );
            }

            const new_crop_batch = new CropBatch();
            new_crop_batch.crop_batch_tag =
              cropBatch.cropBatchTag ||
              `${field.farm.default_start_tag}-${uuidv4().slice(0, 5)}`;
            new_crop_batch.name = cropBatch.name;
            new_crop_batch.crop_type = cropBatch.cropType;
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
            const existingCropBatch = await transactionalEntityManager.findOne(
              CropBatch,
              {
                where: {
                  crop_batch_tag: cropBatch.cropBatchTag,
                },
              },
            );

            if (existingCropBatch) {
              throw new BadRequestException(
                `A crop batch with crop batch tag ${cropBatch.cropBatchTag} already exist`,
              );
            }

            const new_crop_batch = new CropBatch();
            new_crop_batch.crop_batch_tag =
              cropBatch.cropBatchTag ||
              `${greenhouse.farm.default_start_tag}-${uuidv4().slice(0, 5)}`;
            new_crop_batch.name = cropBatch.name;
            new_crop_batch.crop_type = cropBatch.cropType;
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
        fieldToUpdate.gps_coordinates =
          field.gpsCoordinates || fieldToUpdate.gps_coordinates;
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
}
