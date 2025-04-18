import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  Admin,
  Barn,
  BreedingRecord,
  ExpenseRecord,
  Farm,
  GrowthRecord,
  HealthRecord,
  Livestock,
  Pen,
  SalesRecord,
  Worker,
} from "../../database/entities";
import { FarmType } from "../../database/types/farm.type";
import { ILike, In, Repository } from "typeorm";
import {
  BarnInput,
  BarnSortInput,
  BreedingRecordInput,
  ExpenseRecordInput,
  FarmSortInput,
  GrowthRecordInput,
  HealthRecordInput,
  LivestockInput,
  LivestockSortInput,
  PaginationInput,
  PenInput,
  PenSortInput,
  SalesRecordInput,
  UpdateBarnInput,
  UpdateBreedingRecordInput,
  UpdateExpenseRecordInput,
  UpdateGrowthRecordInput,
  UpdateHealthRecordInput,
  UpdateLivestockInput,
  UpdatePenInput,
  UpdateSalesRecordInput,
  WorkerInput,
} from "./inputs";
import { HashHelper } from "../../helpers";
import { v4 as uuidv4 } from "uuid";
import { LivestockGender } from "../../database/types";
import { BreedingStatus } from "../../database/types/breeding-record.type";
import { ProductType } from "../../database/types/sales-record.type";

@Injectable()
export class FarmService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(Farm)
    private farmRepository: Repository<Farm>,
    @InjectRepository(Barn)
    private barnRepository: Repository<Barn>,
    @InjectRepository(Pen)
    private penRepository: Repository<Pen>,
    @InjectRepository(Livestock)
    private livestockRepository: Repository<Livestock>,
    @InjectRepository(BreedingRecord)
    private breedingRecordRepository: Repository<BreedingRecord>,
    @InjectRepository(HealthRecord)
    private healthRecordRepository: Repository<HealthRecord>,
    @InjectRepository(ExpenseRecord)
    private expenseRecordRepository: Repository<ExpenseRecord>,
    @InjectRepository(SalesRecord)
    private salesRecordRepository: Repository<SalesRecord>,
  ) {}

  async listFarmsPaginated({
    email,
    searchTerm,
    pagination,
    sort,
  }: {
    email: string;
    searchTerm?: string;
    pagination: PaginationInput;
    sort?: FarmSortInput[];
  }) {
    // First get all farms that match the filter
    const farms = await this.listFarms({ email, searchTerm });

    // Sort the farms if sort options are provided
    if (sort && sort.length > 0) {
      this.sortFarms(farms, sort);
    }

    // Apply pagination and return in the connection format

    return this.paginate<Farm>(farms, pagination, (farm) => farm.id.toString());
  }

  async listBarnsPaginated({
    email,
    searchTerm,
    pagination,
    sort,
  }: {
    email: string;
    searchTerm?: string;
    pagination: PaginationInput;
    sort?: BarnSortInput[];
  }) {
    const barns = await this.listBarns({ email, searchTerm });

    // Sort the barns if sort options are provided
    if (sort && sort.length > 0) {
      this.sortBarns(barns, sort);
    }

    // Apply pagination and return in the connection format

    return this.paginate<Barn>(barns, pagination, (barn) => barn.id.toString());
  }

  async listPensPaginated({
    email,
    searchTerm,
    pagination,
    sort,
  }: {
    email: string;
    searchTerm?: string;
    pagination: PaginationInput;
    sort?: PenSortInput[];
  }) {
    const pens = await this.listPens({ email, searchTerm });

    // Sort the pens if sort options are provided
    if (sort && sort.length > 0) {
      this.sortPens(pens, sort);
    }

    // Apply pagination and return in the connection format

    return this.paginate<Pen>(pens, pagination, (pen) => pen.id.toString());
  }

  async listLivestockPaginated({
    email,
    searchTerm,
    pagination,
    sort,
  }: {
    email: string;
    searchTerm?: string;
    pagination: PaginationInput;
    sort?: LivestockSortInput[];
  }) {
    const livestock = await this.listLivestock({ email, searchTerm });

    // Sort the livestock if sort options are provided
    if (sort && sort.length > 0) {
      this.sortLivestock(livestock, sort);
    }

    // Apply pagination and return in the connection format

    return this.paginate<Livestock>(livestock, pagination, (livestock) =>
      livestock.id.toString(),
    );
  }

  private sortFarms(farms: Farm[], sortOptions: FarmSortInput[]) {
    farms.sort((a, b) => {
      for (const sort of sortOptions) {
        const { field, direction } = sort;
        const multiplier = direction === "ASC" ? 1 : -1;

        // Handle different field types
        switch (field) {
          case "id":
            if (a.id !== b.id) {
              return (a.id - b.id) * multiplier;
            }
            break;
          case "name":
            const nameCompare = a.name.localeCompare(b.name);
            if (nameCompare !== 0) {
              return nameCompare * multiplier;
            }
            break;
          case "insertedAt":
            if (a["inserted_at"] && b["inserted_at"]) {
              const dateA = new Date(a["inserted_at"]).getTime();
              const dateB = new Date(b["inserted_at"]).getTime();
              if (dateA !== dateB) {
                return (dateA - dateB) * multiplier;
              }
            }
            break;
        }
      }

      // Default sort by ID if all other comparisons are equal
      return a.id - b.id;
    });
  }

  private sortBarns(barns: Barn[], sortOptions: BarnSortInput[]) {
    barns.sort((a, b) => {
      for (const sort of sortOptions) {
        const { field, direction } = sort;
        const multiplier = direction === "ASC" ? 1 : -1;

        // Handle different field types
        switch (field) {
          case "id":
            if (a.id !== b.id) {
              return (a.id - b.id) * multiplier;
            }
            break;
          case "name":
            const nameCompare = a.name.localeCompare(b.name);
            if (nameCompare !== 0) {
              return nameCompare * multiplier;
            }
            break;
          case "status":
            const statusCompare = a.status.localeCompare(b.status);
            if (statusCompare !== 0) {
              return statusCompare * multiplier;
            }
            break;
        }
      }

      // Default sort by ID if all other comparisons are equal
      return a.id - b.id;
    });
  }

  private sortPens(pens: Pen[], sortOptions: PenSortInput[]) {
    pens.sort((a, b) => {
      for (const sort of sortOptions) {
        const { field, direction } = sort;
        const multiplier = direction === "ASC" ? 1 : -1;

        // Handle different field types
        switch (field) {
          case "id":
            if (a.id !== b.id) {
              return (a.id - b.id) * multiplier;
            }
            break;
          case "name":
            const nameCompare = a.name.localeCompare(b.name);
            if (nameCompare !== 0) {
              return nameCompare * multiplier;
            }
            break;
          case "status":
            const statusCompare = a.status.localeCompare(b.status);
            if (statusCompare !== 0) {
              return statusCompare * multiplier;
            }
            break;
        }
      }

      // Default sort by ID if all other comparisons are equal
      return a.id - b.id;
    });
  }

  private sortLivestock(
    livestock: Livestock[],
    sortOptions: LivestockSortInput[],
  ) {
    livestock.sort((a, b) => {
      for (const sort of sortOptions) {
        const { field, direction } = sort;
        const multiplier = direction === "ASC" ? 1 : -1;

        // Handle different field types
        switch (field) {
          case "id":
            if (a.id !== b.id) {
              return (a.id - b.id) * multiplier;
            }
            break;
          case "livestock_type":
            const livestockTypeCompare = a.livestock_type.localeCompare(
              b.livestock_type,
            );
            if (livestockTypeCompare !== 0) {
              return livestockTypeCompare * multiplier;
            }
            break;
        }
      }

      // Default sort by ID if all other comparisons are equal
      return a.id - b.id;
    });
  }

  async listFarms({
    email,
    searchTerm,
  }: {
    email: string;
    searchTerm: string;
  }) {
    return this.farmRepository.find({
      where: {
        admin: {
          email,
        },
        name: ILike(`%${searchTerm}%`),
      },
      relations: ["barns.pens.livestock", "workers"],
    });
  }

  async listBarns({
    email,
    searchTerm,
  }: {
    email: string;
    searchTerm: string;
  }) {
    return this.barnRepository.find({
      where: {
        farm: {
          admin: {
            email,
          },
        },
        name: ILike(`%${searchTerm}%`),
      },
      relations: ["pens.livestock"],
    });
  }

  async getBarn({ email, barnUnitId }: { email: string; barnUnitId: string }) {
    return this.barnRepository.findOne({
      where: {
        farm: {
          admin: {
            email,
          },
        },
        unit_id: barnUnitId,
      },
      relations: ["pens.livestock"],
    });
  }

  async listPens({ email, searchTerm }: { email: string; searchTerm: string }) {
    return this.penRepository.find({
      where: {
        barn: {
          farm: {
            admin: {
              email,
            },
          },
        },
        name: ILike(`%${searchTerm}%`),
      },
      relations: ["livestock"],
    });
  }

  async getPen({ email, penUnitId }: { email: string; penUnitId: string }) {
    return this.penRepository.findOne({
      where: {
        farm: {
          admin: {
            email,
          },
        },
        unit_id: penUnitId,
      },
      relations: ["livestock"],
    });
  }

  async listLivestock({
    email,
    searchTerm,
  }: {
    email: string;
    searchTerm: string;
  }) {
    return this.livestockRepository.find({
      where: {
        pen: {
          barn: {
            farm: {
              admin: {
                email,
              },
            },
          },
        },
        livestock_tag: ILike(`%${searchTerm}%`),
      },
      relations: ["pen"],
    });
  }

  async getLivestock({
    email,
    livestockTag,
  }: {
    email: string;
    livestockTag: string;
  }) {
    return this.livestockRepository.findOne({
      where: {
        livestock_tag: livestockTag,
        pen: {
          farm: {
            admin: {
              email,
            },
          },
        },
      },
      relations: [
        "pen",
        "breeding_records",
        "health_records",
        "expense_records",
        "growth_records",
        "farm.admin",
        "father",
        "mother",
        "maternalOffspring",
        "paternalOffspring",
      ],
    });
  }

  async createFarm({
    email,
    name,
    location,
    area,
    farmType,
  }: {
    email: string;
    name: string;
    location: string;
    area: string;
    farmType: FarmType;
  }) {
    return this.adminRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const admin = await transactionalEntityManager.findOne(Admin, {
          where: {
            email,
          },
          relations: ["farms"],
        });

        if (!admin) {
          throw new NotFoundException("Admin does not exist");
        }

        const farm = new Farm();
        farm.name = name;
        farm.location = location;
        farm.area = area;
        farm.farm_type = farmType;

        admin.farms.push(farm);
        const savedFarm = await transactionalEntityManager.save(Farm, farm);
        await transactionalEntityManager.save(Admin, admin);

        return savedFarm;
      },
    );
  }

  async updateFarm({
    email,
    name,
    location,
    area,
    farmType,
    farmTag,
  }: {
    email: string;
    name: string;
    location: string;
    area: string;
    farmType: FarmType;
    farmTag: string;
  }) {
    return this.farmRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const farm = await transactionalEntityManager.findOne(Farm, {
          where: {
            farm_tag: farmTag,
            admin: {
              email,
            },
          },
        });

        if (!farm) {
          throw new NotFoundException("Farm not found");
        }

        farm.name = name || farm.name;
        farm.location = location || farm.location;
        farm.area = area || farm.area;
        farm.farm_type = farmType || farm.farm_type;

        const savedFarm = await transactionalEntityManager.save(Farm, farm);

        return savedFarm;
      },
    );
  }

  async addWorkersToFarm({
    email,
    farmTag,
    workers,
  }: {
    email: string;
    farmTag: string;
    workers: Array<WorkerInput>;
  }) {
    return this.farmRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const farm = await transactionalEntityManager.findOne(Farm, {
          where: {
            farm_tag: farmTag,
            admin: {
              email,
            },
          },
          relations: ["admin.workers", "workers"],
        });

        if (!farm) {
          throw new NotFoundException("Farm not found");
        }

        const new_workers: Worker[] = await Promise.all(
          workers.map(async (worker) => {
            const existingWorker = await transactionalEntityManager.findOne(
              Worker,
              {
                where: {
                  email: worker.email,
                },
              },
            );

            if (existingWorker) {
              throw new BadRequestException(
                `This email has already been taken, ${worker.email}`,
              );
            }

            const new_worker = new Worker();
            new_worker.name = worker.name;
            new_worker.email = worker.email;
            new_worker.roles = worker.roles;
            new_worker.password = await HashHelper.encrypt(uuidv4());

            return new_worker;
          }),
        );

        // perform bulk save for new_workers
        await transactionalEntityManager.save(new_workers);

        farm.admin.workers = [...farm.admin.workers, ...new_workers];
        farm.workers = [...farm.workers, ...new_workers];

        await transactionalEntityManager.save(Admin, farm.admin);
        return await transactionalEntityManager.save(Farm, farm);
      },
    );
  }

  async assignWorkersToFarm({
    email,
    farmTag,
    workerTags,
  }: {
    email: string;
    farmTag: string;
    workerTags: Array<string>;
  }) {
    return this.farmRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const farm = await transactionalEntityManager.findOne(Farm, {
          where: {
            farm_tag: farmTag,
            admin: {
              email,
            },
          },
          relations: ["admin.workers", "workers"],
        });

        if (!farm) {
          throw new NotFoundException("Farm not found");
        }

        const new_workers: Worker[] = workerTags.map((workerTag) => {
          const adminWorker = farm.admin.workers.find(
            (worker) => worker.worker_tag === workerTag,
          );

          if (!adminWorker) {
            throw new BadRequestException(
              `Admin with tag ${workerTag} does not belong to admin`,
            );
          }

          return adminWorker;
        });

        farm.workers = [...farm.workers, ...new_workers];

        return await transactionalEntityManager.save(Farm, farm);
      },
    );
  }

  async addBarnsToFarm({
    email,
    farmTag,
    barns,
  }: {
    email: string;
    farmTag: string;
    barns: Array<BarnInput>;
  }) {
    return this.farmRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const farm = await transactionalEntityManager.findOne(Farm, {
          where: {
            farm_tag: farmTag,
            admin: {
              email,
            },
          },
          relations: ["barns"],
        });

        if (!farm) {
          throw new NotFoundException("Farm not found");
        }

        const new_barns: Barn[] = await Promise.all(
          barns.map(async (barn) => {
            const existingBarn = await transactionalEntityManager.findOne(
              Barn,
              {
                where: {
                  unit_id: barn.unitId,
                },
              },
            );

            if (existingBarn) {
              throw new BadRequestException(
                `A barn with unit_id ${barn.unitId} already exist`,
              );
            }

            const new_barn = new Barn();
            new_barn.unit_id = barn.unitId;
            new_barn.area_sqm = barn.areaSqm;
            new_barn.capacity = barn.capacity;
            new_barn.climate_controlled = barn.climateControlled;
            new_barn.name = barn.name;
            new_barn.building_material = barn.buildingMaterial || null;
            new_barn.construction_date = barn.constructionDate || null;
            new_barn.ventilation_type = barn.ventilationType || null;

            return new_barn;
          }),
        );

        await transactionalEntityManager.save(new_barns);

        farm.barns = [...farm.barns, ...new_barns];

        return await transactionalEntityManager.save(Farm, farm);
      },
    );
  }

  async updateBarn({
    email,
    barnUnitId,
    barn,
  }: {
    email: string;
    barnUnitId: string;
    barn: UpdateBarnInput;
  }) {
    return this.barnRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const barnToUpdate = await transactionalEntityManager.findOne(Barn, {
          where: {
            unit_id: barnUnitId,
            farm: {
              admin: {
                email,
              },
            },
          },
        });

        if (!barnToUpdate) {
          throw new NotFoundException("Barn not found");
        }

        barnToUpdate.area_sqm = barn.areaSqm || barnToUpdate.area_sqm;
        barnToUpdate.capacity = barn.capacity || barnToUpdate.capacity;
        barnToUpdate.climate_controlled =
          barn.climateControlled || barnToUpdate.climate_controlled;
        barnToUpdate.name = barn.name || barnToUpdate.name;
        barnToUpdate.building_material =
          barn.buildingMaterial || barnToUpdate.building_material;
        barnToUpdate.construction_date =
          barn.constructionDate || barnToUpdate.construction_date;
        barnToUpdate.ventilation_type =
          barn.ventilationType || barnToUpdate.ventilation_type;
        barnToUpdate.status = barn.status || barnToUpdate.status;

        const savedBarn = await transactionalEntityManager.save(
          Barn,
          barnToUpdate,
        );

        return savedBarn;
      },
    );
  }

  async addPensToBarn({
    email,
    barnUnitId,
    pens,
  }: {
    email: string;
    barnUnitId: string;
    pens: Array<PenInput>;
  }) {
    return this.barnRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const barn = await transactionalEntityManager.findOne(Barn, {
          where: {
            unit_id: barnUnitId,
            farm: {
              admin: {
                email,
              },
            },
          },
          relations: ["pens", "farm.pens"],
        });

        if (!barn) {
          throw new NotFoundException("Barn not found");
        }

        const new_pens: Pen[] = await Promise.all(
          pens.map(async (pen) => {
            const existingPen = await transactionalEntityManager.findOne(Pen, {
              where: {
                unit_id: pen.unitId,
              },
            });

            if (existingPen) {
              throw new BadRequestException(
                `A pen with unit_id ${pen.unitId} already exist`,
              );
            }

            const new_pen = new Pen();
            new_pen.unit_id = pen.unitId;
            new_pen.area_sqm = pen.areaSqm;
            new_pen.capacity = pen.capacity;
            new_pen.name = pen.name;
            new_pen.bedding_type = pen.beddingType || null;
            new_pen.feeder_type = pen.feederType || null;
            new_pen.waterer_type = pen.watererType || null;

            return new_pen;
          }),
        );

        await transactionalEntityManager.save(new_pens);

        barn.pens = [...barn.pens, ...new_pens];
        barn.farm.pens = [...barn.farm.pens, ...new_pens];

        await transactionalEntityManager.save(Farm, barn.farm);
        return await transactionalEntityManager.save(Barn, barn);
      },
    );
  }

  async updatePen({
    email,
    penUnitId,
    pen,
  }: {
    email: string;
    penUnitId: string;
    pen: UpdatePenInput;
  }) {
    return this.penRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const penToUpdate = await transactionalEntityManager.findOne(Pen, {
          where: {
            unit_id: penUnitId,
            farm: {
              admin: {
                email,
              },
            },
          },
        });

        if (!penToUpdate) {
          throw new NotFoundException("Pen not found");
        }

        penToUpdate.area_sqm = pen.areaSqm || penToUpdate.area_sqm;
        penToUpdate.capacity = pen.capacity || penToUpdate.capacity;
        penToUpdate.name = pen.name || penToUpdate.name;
        penToUpdate.bedding_type = pen.beddingType || penToUpdate.bedding_type;
        penToUpdate.feeder_type = pen.feederType || penToUpdate.feeder_type;
        penToUpdate.waterer_type = pen.watererType || penToUpdate.waterer_type;
        penToUpdate.status = pen.status || penToUpdate.status;

        const savedPen = await transactionalEntityManager.save(
          Pen,
          penToUpdate,
        );

        return savedPen;
      },
    );
  }

  async addLivestockToPen({
    email,
    penUnitId,
    livestock,
  }: {
    email: string;
    penUnitId: string;
    livestock: Array<LivestockInput>;
  }) {
    return this.penRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const pen = await transactionalEntityManager.findOne(Pen, {
          where: {
            unit_id: penUnitId,
            farm: {
              admin: {
                email,
              },
            },
          },
          relations: ["livestock", "farm.livestock"],
        });

        if (!pen) {
          throw new NotFoundException("Pen not found");
        }

        const new_livestock: Livestock[] = await Promise.all(
          livestock.map(async (livestock) => {
            const existingLivestock = await transactionalEntityManager.findOne(
              Livestock,
              {
                where: {
                  livestock_tag: livestock.livestockTag,
                },
              },
            );

            if (existingLivestock) {
              throw new BadRequestException(
                `A livestock with livestock tag ${livestock.livestockTag} already exist`,
              );
            }

            const new_livestock = new Livestock();
            new_livestock.livestock_tag = livestock.livestockTag;
            new_livestock.birth_date = livestock.birthDate;
            new_livestock.breed = livestock.breed;
            new_livestock.weight = livestock.weight;
            new_livestock.livestock_type = livestock.livestockType;
            new_livestock.gender = livestock.gender;

            return new_livestock;
          }),
        );

        await transactionalEntityManager.save(new_livestock);

        pen.livestock = [...pen.livestock, ...new_livestock];
        pen.farm.livestock = [...pen.farm.livestock, ...new_livestock];

        await transactionalEntityManager.save(Farm, pen.farm);
        return await transactionalEntityManager.save(Pen, pen);
      },
    );
  }

  async updateLivestock({
    email,
    livestockTag,
    livestock,
  }: {
    email: string;
    livestockTag: string;
    livestock: UpdateLivestockInput;
  }) {
    return this.livestockRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const livestockToUpdate = await transactionalEntityManager.findOne(
          Livestock,
          {
            where: {
              livestock_tag: livestockTag,
              farm: {
                admin: {
                  email,
                },
              },
            },
            relations: [
              "mother",
              "father",
              "maternalOffspring",
              "paternalOffspring",
            ],
          },
        );

        if (!livestockToUpdate) {
          throw new NotFoundException("Livestock not found");
        }

        livestock.offspringTags = livestock.offspringTags
          ? livestock.offspringTags
          : [];

        const offsprings = await transactionalEntityManager.find(Livestock, {
          where: {
            livestock_tag: In(livestock.offspringTags),
            farm: {
              admin: {
                email,
              },
            },
          },
        });

        let mother: Livestock = null;

        if (livestock.motherTag) {
          mother = await transactionalEntityManager.findOne(Livestock, {
            where: {
              livestock_tag: livestock.motherTag,
              gender: LivestockGender.FEMALE,
              farm: {
                admin: {
                  email,
                },
              },
            },
            relations: ["maternalOffspring", "paternalOffspring"],
          });

          if (!mother) {
            throw new NotFoundException(
              `A female livestock with livestock tag ${livestock.motherTag} does not exist`,
            );
          }

          if (mother.livestock_tag === livestockTag) {
            throw new BadRequestException(
              "You cannot assign a livestock as its own parent",
            );
          }

          if (
            new Date(mother.birth_date).valueOf() >
            new Date(livestockToUpdate.birth_date).valueOf()
          ) {
            throw new BadRequestException(
              "Livestock must be younger than mother",
            );
          }
        }

        let father: Livestock = null;

        if (livestock.fatherTag) {
          father = await transactionalEntityManager.findOne(Livestock, {
            where: {
              livestock_tag: livestock.fatherTag,
              gender: LivestockGender.MALE,
              farm: {
                admin: {
                  email,
                },
              },
            },
            relations: ["maternalOffspring", "paternalOffspring"],
          });

          if (!father) {
            throw new NotFoundException(
              `A male livestock with livestock tag ${livestock.fatherTag} does not exist`,
            );
          }

          if (father.livestock_tag === livestockTag) {
            throw new BadRequestException(
              "You cannot assign a livestock as its own parent",
            );
          }

          if (
            new Date(father.birth_date).valueOf() >
            new Date(livestockToUpdate.birth_date).valueOf()
          ) {
            throw new BadRequestException(
              "Livestock must be younger than father",
            );
          }
        }

        livestockToUpdate.birth_date =
          livestock.birthDate || livestockToUpdate.birth_date;
        livestockToUpdate.breed = livestock.breed || livestockToUpdate.breed;
        livestockToUpdate.weight = livestock.weight || livestockToUpdate.weight;
        livestockToUpdate.livestock_type =
          livestock.livestockType || livestockToUpdate.livestock_type;
        livestockToUpdate.gender = livestock.gender || livestockToUpdate.gender;
        livestockToUpdate.milk_production =
          livestock.milkProduction || livestockToUpdate.milk_production;
        livestockToUpdate.meat_grade =
          livestock.meatGrade || livestockToUpdate.meat_grade;

        if (livestockToUpdate.gender === LivestockGender.MALE) {
          livestockToUpdate.paternalOffspring = offsprings.length
            ? offsprings
            : livestockToUpdate.paternalOffspring;
        } else {
          livestockToUpdate.maternalOffspring = offsprings.length
            ? offsprings
            : livestockToUpdate.maternalOffspring;
        }

        const currentMother = livestockToUpdate.mother;
        const currentFather = livestockToUpdate.father;

        // If the current mother is different from the new mother, remove from old mother's offspring
        if (currentMother && (!mother || currentMother.id !== mother.id)) {
          currentMother.maternalOffspring =
            currentMother?.maternalOffspring?.filter(
              (child) => child.id !== livestockToUpdate.id,
            );
          await transactionalEntityManager.save(Livestock, currentMother);
        }

        // If the current father is different from the new father, remove from old father's offspring
        if (currentFather && (!father || currentFather.id !== father.id)) {
          currentFather.paternalOffspring =
            currentFather?.paternalOffspring?.filter(
              (child) => child.id !== livestockToUpdate.id,
            );
          await transactionalEntityManager.save(Livestock, currentFather);
        }

        // Now assign the new parents
        livestockToUpdate.mother = mother || livestockToUpdate.mother;
        livestockToUpdate.father = father || livestockToUpdate.father;

        // Initialize arrays if they don't exist
        if (mother && !mother.maternalOffspring) mother.maternalOffspring = [];
        if (father && !father.paternalOffspring) father.paternalOffspring = [];

        // Add to new parents' offspring arrays if not already there
        const isInMotherOffspring = mother?.maternalOffspring?.some(
          (child) => child.id === livestockToUpdate.id,
        );
        const isInFatherOffspring = father?.paternalOffspring?.some(
          (child) => child.id === livestockToUpdate.id,
        );

        if (mother && !isInMotherOffspring) {
          mother.maternalOffspring.push(livestockToUpdate);
          await transactionalEntityManager.save(Livestock, mother);
        }

        if (father && !isInFatherOffspring) {
          father.paternalOffspring.push(livestockToUpdate);
          await transactionalEntityManager.save(Livestock, father);
        }

        const savedLivestock = await transactionalEntityManager.save(
          Livestock,
          livestockToUpdate,
        );

        return savedLivestock;
      },
    );
  }

  async addLivestockBreedingRecord({
    email,
    maleLivestockTag,
    femaleLivestockTag,
    breedingRecord,
  }: {
    email: string;
    maleLivestockTag: string;
    femaleLivestockTag: string;
    breedingRecord: BreedingRecordInput;
  }) {
    return this.breedingRecordRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const maleLivestock = await transactionalEntityManager.findOne(
          Livestock,
          {
            where: {
              livestock_tag: maleLivestockTag,
              gender: LivestockGender.MALE,
              farm: {
                admin: {
                  email,
                },
              },
            },
            relations: ["breeding_records", "pen"],
          },
        );

        if (!maleLivestock) {
          throw new NotFoundException("Male livestock not found");
        }

        const femaleLivestock = await transactionalEntityManager.findOne(
          Livestock,
          {
            where: {
              livestock_tag: femaleLivestockTag,
              gender: LivestockGender.FEMALE,
              farm: {
                admin: {
                  email,
                },
              },
            },
            relations: ["breeding_records", "pen"],
          },
        );

        if (!femaleLivestock) {
          throw new NotFoundException("Female livestock not found");
        }

        if (maleLivestock.pen.unit_id !== femaleLivestock.pen.unit_id) {
          throw new BadRequestException(
            "Livestock must be in the same pen to create a breeding record",
          );
        }

        const femaleHasAnActiveBreedingRecord =
          femaleLivestock.breeding_records.some((record) =>
            [BreedingStatus.PLANNED, BreedingStatus.IN_PROGRESS].includes(
              record.status,
            ),
          );

        if (femaleHasAnActiveBreedingRecord) {
          throw new ConflictException(
            "Female livestock already has an active breeding record",
          );
        }

        const newBreedingRecord = new BreedingRecord();
        newBreedingRecord.expected_delivery = breedingRecord.expectedDelivery;
        newBreedingRecord.status = breedingRecord.status;
        newBreedingRecord.mating_date = breedingRecord.matingDate;
        newBreedingRecord.notes = breedingRecord.notes;
        newBreedingRecord.breeding_method = breedingRecord.breedingMethod;

        const savedBreedingRecord = await transactionalEntityManager.save(
          BreedingRecord,
          newBreedingRecord,
        );

        maleLivestock.breeding_records.push(newBreedingRecord);
        femaleLivestock.breeding_records.push(newBreedingRecord);

        await transactionalEntityManager.save([maleLivestock, femaleLivestock]);

        return savedBreedingRecord;
      },
    );
  }

  async updateLivestockBreedingRecord({
    email,
    breedingRecordId,
    breedingRecord,
  }: {
    email: string;
    breedingRecordId: number;
    breedingRecord: UpdateBreedingRecordInput;
  }) {
    return this.breedingRecordRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const pen = await transactionalEntityManager.findOne(Pen, {
          where: {
            farm: {
              admin: {
                email,
              },
              livestock: {
                breeding_records: {
                  id: breedingRecordId,
                },
              },
            },
          },
          relations: ["farm.livestock.breeding_records"],
        });

        let breedingRecordToUpdate: BreedingRecord;
        if (pen) {
          breedingRecordToUpdate = await transactionalEntityManager.findOne(
            BreedingRecord,
            {
              where: {
                id: breedingRecordId,
              },
            },
          );
        }

        if (!breedingRecordToUpdate) {
          throw new NotFoundException("Breeding record not found");
        }

        breedingRecordToUpdate.expected_delivery =
          breedingRecord.expectedDelivery ||
          breedingRecordToUpdate.expected_delivery;
        breedingRecordToUpdate.status =
          breedingRecord.status || breedingRecordToUpdate.status;
        breedingRecordToUpdate.mating_date =
          breedingRecord.matingDate || breedingRecordToUpdate.mating_date;
        breedingRecordToUpdate.notes =
          breedingRecord.notes || breedingRecordToUpdate.notes;
        breedingRecordToUpdate.breeding_method =
          breedingRecord.breedingMethod ||
          breedingRecordToUpdate.breeding_method;
        breedingRecordToUpdate.actual_delivery =
          breedingRecord.actualDelivery ||
          breedingRecordToUpdate.actual_delivery;
        // offspringCountMale
        breedingRecordToUpdate.offspring_count_male =
          breedingRecord.offspringCountMale ||
          breedingRecordToUpdate.offspring_count_male;
        // offspringCountFemale
        breedingRecordToUpdate.offspring_count_female =
          breedingRecord.offspringCountFemale ||
          breedingRecordToUpdate.offspring_count_female;

        const updatedBreedingRecord = await transactionalEntityManager.save(
          BreedingRecord,
          breedingRecordToUpdate,
        );

        return updatedBreedingRecord;
      },
    );
  }

  async addLivestockHealthRecord({
    email,
    livestockTag,
    healthRecord,
  }: {
    email: string;
    livestockTag: string;
    healthRecord: HealthRecordInput;
  }) {
    return this.healthRecordRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const livestock = await transactionalEntityManager.findOne(Livestock, {
          where: {
            livestock_tag: livestockTag,
            farm: {
              admin: {
                email,
              },
            },
          },
          relations: ["health_records"],
        });

        if (!livestock) {
          throw new NotFoundException("Livestock not found");
        }

        const newHealthRecord = new HealthRecord();
        newHealthRecord.cost = healthRecord.cost;
        newHealthRecord.diagnosis = healthRecord.diagnosis;
        newHealthRecord.dosage = healthRecord.dosage || newHealthRecord.dosage;
        newHealthRecord.issue = healthRecord.issue;
        newHealthRecord.medication =
          healthRecord.medication || newHealthRecord.medication;
        newHealthRecord.notes = healthRecord.notes;
        newHealthRecord.symptoms = healthRecord.symptoms;
        newHealthRecord.treatment = healthRecord.treatment;
        newHealthRecord.vet_name =
          healthRecord.vetName || newHealthRecord.vet_name;
        newHealthRecord.record_date = healthRecord.recordDate;
        newHealthRecord.livestock = livestock;

        const savedHealthRecord = await transactionalEntityManager.save(
          HealthRecord,
          newHealthRecord,
        );

        livestock.health_records.push(savedHealthRecord);

        await transactionalEntityManager.save(Livestock, livestock);

        return savedHealthRecord;
      },
    );
  }

  async updateLivestockHealthRecord({
    email,
    healthRecordId,
    healthRecord,
  }: {
    email: string;
    healthRecordId: number;
    healthRecord: UpdateHealthRecordInput;
  }) {
    return this.healthRecordRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const healthRecordToUpdate = await transactionalEntityManager.findOne(
          HealthRecord,
          {
            where: {
              id: healthRecordId,
              livestock: { farm: { admin: { email } } },
            },
          },
        );

        if (!healthRecordToUpdate) {
          throw new NotFoundException("Health record not found");
        }

        healthRecordToUpdate.cost =
          healthRecord.cost || healthRecordToUpdate.cost;
        healthRecordToUpdate.diagnosis =
          healthRecord.diagnosis || healthRecordToUpdate.diagnosis;
        healthRecordToUpdate.dosage =
          healthRecord.dosage || healthRecordToUpdate.dosage;
        healthRecordToUpdate.issue =
          healthRecord.issue || healthRecordToUpdate.issue;
        healthRecordToUpdate.medication =
          healthRecord.medication || healthRecordToUpdate.medication;
        healthRecordToUpdate.notes =
          healthRecord.notes || healthRecordToUpdate.notes;
        healthRecordToUpdate.symptoms =
          healthRecord.symptoms || healthRecordToUpdate.symptoms;
        healthRecordToUpdate.treatment =
          healthRecord.treatment || healthRecordToUpdate.treatment;
        healthRecordToUpdate.vet_name =
          healthRecord.vetName || healthRecordToUpdate.vet_name;
        healthRecordToUpdate.record_date =
          healthRecord.recordDate || healthRecordToUpdate.record_date;

        const savedHealthRecord = await transactionalEntityManager.save(
          HealthRecord,
          healthRecordToUpdate,
        );

        return savedHealthRecord;
      },
    );
  }

  async addLivestockGrowthRecord({
    email,
    livestockTag,
    growthRecord,
  }: {
    email: string;
    livestockTag: string;
    growthRecord: GrowthRecordInput;
  }) {
    return this.healthRecordRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const livestock = await transactionalEntityManager.findOne(Livestock, {
          where: {
            livestock_tag: livestockTag,
            farm: {
              admin: {
                email,
              },
            },
          },
          relations: ["growth_records"],
        });

        if (!livestock) {
          throw new NotFoundException("Livestock not found");
        }

        const newGrowthRecord = new GrowthRecord();
        newGrowthRecord.record_date = growthRecord.recordDate;
        newGrowthRecord.weight = growthRecord.weight;
        newGrowthRecord.period = growthRecord.period;
        newGrowthRecord.feed_conversion =
          growthRecord.feedConversion || newGrowthRecord.feed_conversion;
        newGrowthRecord.growth_rate =
          growthRecord.growthRate || newGrowthRecord.growth_rate;
        newGrowthRecord.height = growthRecord.height || newGrowthRecord.height;
        newGrowthRecord.length = growthRecord.length || newGrowthRecord.length;
        newGrowthRecord.notes = growthRecord.notes;
        newGrowthRecord.livestock = livestock;

        const savedGrowthRecord = await transactionalEntityManager.save(
          GrowthRecord,
          newGrowthRecord,
        );

        livestock.growth_records.push(savedGrowthRecord);

        await transactionalEntityManager.save(Livestock, livestock);

        return savedGrowthRecord;
      },
    );
  }

  async updateLivestockGrowthRecord({
    email,
    growthRecordId,
    growthRecord,
  }: {
    email: string;
    growthRecordId: number;
    growthRecord: UpdateGrowthRecordInput;
  }) {
    return this.healthRecordRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const growthRecordToUpdate = await transactionalEntityManager.findOne(
          GrowthRecord,
          {
            where: {
              id: growthRecordId,
              livestock: { farm: { admin: { email } } },
            },
          },
        );

        if (!growthRecordToUpdate) {
          throw new NotFoundException("Growth record not found");
        }

        growthRecordToUpdate.record_date =
          growthRecord.recordDate || growthRecordToUpdate.record_date;
        growthRecordToUpdate.weight =
          growthRecord.weight || growthRecordToUpdate.weight;
        growthRecordToUpdate.period =
          growthRecord.period || growthRecordToUpdate.period;
        growthRecordToUpdate.feed_conversion =
          growthRecord.feedConversion || growthRecordToUpdate.feed_conversion;
        growthRecordToUpdate.growth_rate =
          growthRecord.growthRate || growthRecordToUpdate.growth_rate;
        growthRecordToUpdate.height =
          growthRecord.height || growthRecordToUpdate.height;
        growthRecordToUpdate.length =
          growthRecord.length || growthRecordToUpdate.length;
        growthRecordToUpdate.notes =
          growthRecord.notes || growthRecordToUpdate.notes;

        const savedGrowthRecord = await transactionalEntityManager.save(
          GrowthRecord,
          growthRecordToUpdate,
        );

        return savedGrowthRecord;
      },
    );
  }

  async addLivestockExpenseRecord({
    email,
    livestockTag,
    expenseRecord,
  }: {
    email: string;
    livestockTag: string;
    expenseRecord: ExpenseRecordInput;
  }) {
    return this.expenseRecordRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const livestock = await transactionalEntityManager.findOne(Livestock, {
          where: {
            livestock_tag: livestockTag,
            farm: {
              admin: {
                email,
              },
            },
          },
          relations: ["expense_records"],
        });

        if (!livestock) {
          throw new NotFoundException("Livestock not found");
        }

        const newExpenseRecord = new ExpenseRecord();
        newExpenseRecord.amount = expenseRecord.amount;
        newExpenseRecord.expense_date = expenseRecord.expenseDate;
        newExpenseRecord.category = expenseRecord.category;
        newExpenseRecord.notes = expenseRecord.notes;
        newExpenseRecord.livestock = livestock;

        const savedExpenseRecord = await transactionalEntityManager.save(
          ExpenseRecord,
          newExpenseRecord,
        );

        livestock.expense_records.push(savedExpenseRecord);

        await transactionalEntityManager.save(Livestock, livestock);

        return savedExpenseRecord;
      },
    );
  }

  async updateLivestockExpenseRecord({
    email,
    expenseRecordId,
    expenseRecord,
  }: {
    email: string;
    expenseRecordId: number;
    expenseRecord: UpdateExpenseRecordInput;
  }) {
    return this.expenseRecordRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const expenseRecordToUpdate = await transactionalEntityManager.findOne(
          ExpenseRecord,
          {
            where: {
              id: expenseRecordId,
              livestock: { farm: { admin: { email } } },
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

  async addLivestockSalesRecord({
    email,
    livestockTag,
    salesRecord,
  }: {
    email: string;
    livestockTag: string;
    salesRecord: SalesRecordInput;
  }) {
    return this.salesRecordRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const livestock = await transactionalEntityManager.findOne(Livestock, {
          where: {
            livestock_tag: livestockTag,
            farm: {
              admin: {
                email,
              },
            },
          },
        });

        if (!livestock) {
          throw new NotFoundException("Livestock not found");
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
        newSalesRecord.product_type = ProductType.LIVESTOCK;
        newSalesRecord.livestock = livestock;

        const savedSalesRecord = await transactionalEntityManager.save(
          SalesRecord,
          newSalesRecord,
        );

        return savedSalesRecord;
      },
    );
  }

  async updateLivestockSalesRecord({
    email,
    salesRecordId,
    salesRecord,
  }: {
    email: string;
    salesRecordId: number;
    salesRecord: UpdateSalesRecordInput;
  }) {
    return this.salesRecordRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const salesRecordToUpdate = await transactionalEntityManager.findOne(
          SalesRecord,
          {
            where: {
              id: salesRecordId,
              livestock: { farm: { admin: { email } } },
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
