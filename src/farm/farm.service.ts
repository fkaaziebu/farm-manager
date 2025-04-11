import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";

// Dto's
import type {
  AddAnimalBreedingRecordBodyDto,
  AddAnimalExpenseRecordBodyDto,
  AddAnimalExpenseRecordParamsDto,
  AddAnimalGrowthRecordBodyDto,
  AddAnimalHealthRecordBodyDto,
  AddAnimalSalesRecordBodyDto,
  AddAnimalsToRoomBodyDto,
  AddAnimalsToRoomParamsDto,
  AddFarmWorkersBodyDto,
  AddFarmWorkersParamsDto,
  AddHousesToFarmBodyDto,
  AddRoomsToHouseBodyDto,
  AddRoomsToHouseParamsDto,
  CreateFarmBodyDto,
} from "./dto";
import type { FarmFilterInput } from "./inputs/farm-filters.input";

// Entities
import { Admin } from "../entities/admin.entity";
import { Farm } from "../entities/farm.entity";
import { House } from "../entities/house.entity";
import { Room } from "../entities/room.entity";
import { Animal } from "../entities/animal.entity";
import { BreedingRecord } from "../entities/breeding_record.entity";
import { ExpenseRecord } from "../entities/expense_record.entity";
import { GrowthRecord } from "../entities/growth_record.entity";
import { HealthRecord } from "../entities/health_record.entity";
import { SalesRecord } from "../entities/sales_record.entity";
import { Worker, WorkerRole } from "../entities/worker.entity";
import {
  applyBooleanFilter,
  applyDateFilter,
  applyIntFilter,
  applyStringFilter,
} from "./utils/filter-utils";
import type { PaginationInput } from "./pagination/pagination.type";
import type { FarmSortInput } from "./inputs/farm-sort.input";
import { PaginationService } from "./pagination/pagination.service";

@Injectable()
export class FarmService {
  constructor(
    private readonly paginationService: PaginationService,
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(Worker)
    private workerRepository: Repository<Worker>,
    @InjectRepository(Farm)
    private farmRepository: Repository<Farm>,
    @InjectRepository(House)
    private houseRepository: Repository<House>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(Animal)
    private animalRepository: Repository<Animal>,
  ) {}

  async createWorkers({
    email,
    workers,
  }: {
    email: string;
    workers: Array<{
      name: string;
      email: string;
      role: WorkerRole;
      password: string;
    }>;
  }) {
    return await this.adminRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const admin = await transactionalEntityManager.findOne(Admin, {
          where: { email },
          relations: ["workers"],
        });

        if (!admin) {
          throw new BadRequestException("Admin does not exist");
        }

        const new_workers: Worker[] = await Promise.all(
          workers.map(async (worker) => {
            const workerBelongesToAdmin = admin.workers.find(
              (wkr) => wkr.email === worker.email,
            );

            if (workerBelongesToAdmin) {
              throw new BadRequestException(
                `This email has been used for a worker by you, ${worker.email}`,
              );
            }

            const workerBelongesToOtherAdmin =
              await this.workerRepository.findOne({
                where: {
                  email: worker.email,
                },
              });

            if (workerBelongesToOtherAdmin) {
              throw new BadRequestException(
                `This email has been used for a worker by a different admin, ${worker.email}`,
              );
            }

            const new_worker = new Worker();
            new_worker.name = worker.name;
            new_worker.email = worker.email;
            new_worker.roles = [worker.role];
            new_worker.password = await this.hashPassword(worker.password);

            return this.workerRepository.save(new_worker);
          }),
        );

        admin.workers = [...new_workers, ...admin.workers];

        await transactionalEntityManager.save(Admin, admin);

        return {
          workerIds: new_workers.map((wk) => ({ id: wk.id })),
          message: "Worker(s) created successfully",
        };
      },
    );
  }

  async addFarmWorkers({
    email,
    farmId,
    workerIds,
  }: AddFarmWorkersParamsDto & AddFarmWorkersBodyDto & { email: string }) {
    return this.farmRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const admin = await this.adminRepository.findOne({
          where: {
            email,
          },
          relations: ["farms.workers", "workers.farms"],
        });

        if (!admin) {
          throw new BadRequestException("Admin does not exist");
        }

        const farmBelongsToAdmin = admin.farms.find(
          (fm) => fm.id === Number(farmId),
        );

        if (!farmBelongsToAdmin) {
          throw new BadRequestException(
            `Admin does not have a farm with id ${farmId}`,
          );
        }

        const workersBelongingToAdmin = admin.workers.filter((wk) =>
          Boolean(workerIds.find((wkId) => wkId.id === wk.id)),
        );

        const newFarmWorkers = workersBelongingToAdmin.filter(
          (newWk) =>
            !farmBelongsToAdmin.workers.find((wk) => wk.id === newWk.id),
        );

        farmBelongsToAdmin.workers = [
          ...farmBelongsToAdmin.workers,
          ...newFarmWorkers,
        ];

        await transactionalEntityManager.save(Farm, farmBelongsToAdmin);

        return {
          ...newFarmWorkers[0],
          message: `${newFarmWorkers.length} out of ${workerIds.length} Worker(s) added to farm successfully`,
        };
      },
    );
  }

  async addHousesToFarm({
    email,
    farmId,
    houses,
  }: AddHousesToFarmBodyDto & AddFarmWorkersParamsDto & { email: string }) {
    return this.farmRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const admin = await this.adminRepository.findOne({
          where: {
            email,
          },
          relations: ["farms.houses"],
        });

        if (!admin) {
          throw new BadRequestException("Admin does not exist");
        }

        let new_houses: House[] = await Promise.all(
          houses.map(async (house) => {
            const houseBelongsToAdmin = admin.farms
              .find((fm) => fm.id === Number(farmId))
              .houses.find((hs) => hs.house_number === house.house_number);

            if (houseBelongsToAdmin) {
              return null;
            }

            const houseBelongsToOtherAdmin = await this.houseRepository.findOne(
              {
                where: {
                  house_number: house.house_number,
                },
              },
            );

            if (houseBelongsToOtherAdmin) {
              throw new BadRequestException(
                `The house number ${house.house_number} has been taken`,
              );
            }

            const new_house = new House();
            new_house.house_number = house.house_number;

            return this.houseRepository.save(new_house);
          }),
        );

        new_houses = new_houses.filter((hs) => hs);

        const adminFarm = admin.farms.find((fm) => fm.id === Number(farmId));

        adminFarm.houses = [...adminFarm.houses, ...new_houses];

        await transactionalEntityManager.save(Farm, adminFarm);

        return {
          message: `${new_houses.length} out of ${houses.length} houses added to farm`,
        };
      },
    );
  }

  async addRoomsToHouse({
    email,
    farmId,
    houseNumber,
    rooms,
  }: AddRoomsToHouseParamsDto & AddRoomsToHouseBodyDto & { email: string }) {
    return this.houseRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const admin = await this.adminRepository.findOne({
          where: {
            email,
          },
          relations: ["farms.houses.rooms"],
        });

        if (!admin) {
          throw new BadRequestException("Admin does not exist");
        }

        const new_rooms: Room[] = await Promise.all(
          rooms.map(async (room) => {
            const roomBelongsToOtherAdmin = await this.roomRepository.findOne({
              where: {
                room_number: room.room_number,
              },
            });

            if (roomBelongsToOtherAdmin) {
              return;
            }

            const new_room = new Room();
            new_room.room_number = room.room_number;

            return this.roomRepository.save(new_room);
          }),
        );

        const farmHouse = admin.farms
          .find((fm) => fm.id === Number(farmId))
          .houses.find((hs) => hs.house_number === houseNumber);

        farmHouse.rooms = [
          ...farmHouse.rooms,
          ...new_rooms.filter((rm) => rm?.room_number),
        ];

        const savedResult = await transactionalEntityManager.save(
          House,
          farmHouse,
        );

        return {
          ...savedResult,
          message: "Rooms added to house successfully",
        };
      },
    );
  }

  async addHouseToFarm({
    farmId,
    houseNumber,
    rooms,
    email,
  }: AddRoomsToHouseParamsDto & AddRoomsToHouseBodyDto & { email: string }) {
    try {
      await this.addHousesToFarm({
        email,
        farmId,
        houses: [{ house_number: houseNumber }],
      });

      return this.addRoomsToHouse({
        email,
        farmId,
        houseNumber,
        rooms,
      });
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async addAnimalsToRoom({
    email,
    farmId,
    houseNumber,
    roomNumber,
    animals,
  }: AddAnimalsToRoomParamsDto & AddAnimalsToRoomBodyDto & { email: string }) {
    return this.roomRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const admin = await this.adminRepository.findOne({
          where: {
            email,
          },
          relations: ["farms.animals", "farms.houses.rooms.animals"],
        });

        if (!admin) {
          throw new BadRequestException("Admin does not exist");
        }

        const adminFarm = admin.farms.find((fm) => fm.id === Number(farmId));
        const adminRoom = admin.farms
          .find((fm) => fm.id === Number(farmId))
          ?.houses.find((hs) => hs.house_number === houseNumber)
          ?.rooms.find((rm) => rm.room_number === roomNumber);

        if (!adminRoom) {
          throw new BadRequestException(
            "Either farm or house or rooms does not belong to admin",
          );
        }

        const new_animals: Animal[] = await Promise.all(
          animals.map(async (animal) => {
            const animalTagNumberTaken = await this.animalRepository.findOne({
              where: {
                tag_number: animal.tag_number,
              },
            });

            if (animalTagNumberTaken) {
              throw new BadRequestException(
                `The tag number ${animal.tag_number} has been taken`,
              );
            }

            const new_animal = new Animal();
            new_animal.tag_number = animal.tag_number;
            new_animal.gender = animal.gender;
            new_animal.birth_date = animal.birth_date;
            new_animal.breed = animal.breed;

            return this.animalRepository.save(new_animal);
          }),
        );

        adminRoom.animals = [...adminRoom.animals, ...new_animals];
        adminFarm.animals = [...adminFarm.animals, ...new_animals];

        await transactionalEntityManager.save(Room, adminRoom);
        const savedResult = await transactionalEntityManager.save(
          Farm,
          adminFarm,
        );

        return {
          ...savedResult,
          message: "Animals added to room successfully",
        };
      },
    );
  }

  async addAnimalBreedingRecord({
    email,
    role,
    maleTagNumber,
    femaleTagNumber,
    matingDate,
    expectedDelivery,
  }: AddAnimalBreedingRecordBodyDto & {
    email: string;
    role: "WORKER" | "ADMIN";
  }) {
    return this.animalRepository.manager.transaction(
      async (transactionalEntityManager) => {
        let user: Admin | Worker;
        if (role === "ADMIN") {
          user = await this.adminRepository.findOne({
            where: {
              email,
            },
            relations: ["farms.animals.room", "farms.animals.breeding_records"],
          });
        } else if (role === "WORKER") {
          user = await this.workerRepository.findOne({
            where: {
              email,
            },
            relations: ["farms.animals.room", "farms.animals.breeding_records"],
          });
        }

        if (!user) {
          throw new BadRequestException("User does not exist");
        }

        let maleAnimal: Animal;
        let femaleAnimal: Animal;

        user.farms.map((farm) => {
          farm.animals.map((anl) => {
            if (anl.tag_number === maleTagNumber) {
              maleAnimal = anl;
            }

            if (anl.tag_number === femaleTagNumber) {
              femaleAnimal = anl;
            }
          });
        });

        if (!maleAnimal) {
          throw new BadRequestException(
            `Male with tagNumber ${maleTagNumber} does not belong to this farm`,
          );
        }

        if (!femaleAnimal) {
          throw new BadRequestException(
            `Female with tagNumber ${femaleTagNumber} does not belong to this farm`,
          );
        }

        if (maleAnimal.gender === "FEMALE") {
          throw new BadRequestException(
            `Animal with tag number ${maleTagNumber} is not a male`,
          );
        }

        if (femaleAnimal.gender === "MALE") {
          throw new BadRequestException(
            `Animal with tag number ${femaleTagNumber} is not a female`,
          );
        }

        if (maleAnimal.room.room_number !== femaleAnimal.room.room_number) {
          throw new BadRequestException(
            "Animals must be in the same room to create a breeding record",
          );
        }

        const maleInProgressRecords = maleAnimal.breeding_records.filter(
          (record) => record.status === "IN_PROGRESS",
        );

        const femaleInProgressRecords = femaleAnimal.breeding_records.filter(
          (record) => record.status === "IN_PROGRESS",
        );

        // Look for any common breeding records between the two animals
        const commonRecords = maleInProgressRecords.filter((maleRecord) =>
          femaleInProgressRecords.some(
            (femaleRecord) => femaleRecord.id === maleRecord.id,
          ),
        );

        if (commonRecords.length > 0) {
          throw new BadRequestException(
            "These animals already have an in-progress breeding record",
          );
        }

        const new_breeding_record = new BreedingRecord();
        new_breeding_record.mating_date = matingDate;
        new_breeding_record.expected_delivery = expectedDelivery;

        femaleAnimal.breeding_records = [
          ...femaleAnimal.breeding_records,
          new_breeding_record,
        ];

        maleAnimal.breeding_records = [
          ...maleAnimal.breeding_records,
          new_breeding_record,
        ];

        const savedResult = await transactionalEntityManager.save(
          BreedingRecord,
          new_breeding_record,
        );
        const savedFemale = await transactionalEntityManager.save(
          Animal,
          femaleAnimal,
        );
        const savedMale = await transactionalEntityManager.save(
          Animal,
          maleAnimal,
        );

        return {
          ...savedResult,
          animals: [savedFemale, savedMale],
          message: `Breeding records for ${maleTagNumber} and ${femaleTagNumber} created successfully`,
        };
      },
    );
  }

  async addAnimalExpenseRecord({
    email,
    role,
    tagNumber,
    category,
    expenseDate,
    amount,
    notes,
  }: AddAnimalExpenseRecordParamsDto &
    AddAnimalExpenseRecordBodyDto & {
      email: string;
      role: "ADMIN" | "WORKER";
    }) {
    return this.animalRepository.manager.transaction(
      async (transactionalEntityManager) => {
        let user: Admin | Worker;
        if (role === "ADMIN") {
          user = await this.adminRepository.findOne({
            where: {
              email,
            },
            relations: ["farms.animals.expense_records"],
          });
        } else if (role === "WORKER") {
          user = await this.workerRepository.findOne({
            where: {
              email,
            },
            relations: ["farms.animals.expense_records"],
          });
        }

        if (!user) {
          throw new BadRequestException("User does not exist");
        }

        // find animal from admin farms
        let animal: Animal;

        user.farms.map((farm) => {
          farm.animals.map((anl) => {
            if (anl.tag_number === tagNumber) {
              animal = anl;
            }
          });
        });

        if (!animal) {
          throw new BadRequestException(
            `Animal with tag ${tagNumber} does not belong to this farm`,
          );
        }

        const new_expense_record = new ExpenseRecord();
        new_expense_record.expense_date = expenseDate;
        new_expense_record.amount = amount;
        new_expense_record.category = category;
        new_expense_record.notes = notes || "";

        animal.expense_records = [
          ...animal.expense_records,
          new_expense_record,
        ];

        await transactionalEntityManager.save(
          ExpenseRecord,
          new_expense_record,
        );
        await transactionalEntityManager.save(Animal, animal);

        return {
          message: "Expense record created successfully",
        };
      },
    );
  }

  async addAnimalGrowthRecord({
    email,
    role,
    tagNumber,
    period,
    growthRate,
    notes,
  }: AddAnimalExpenseRecordParamsDto &
    AddAnimalGrowthRecordBodyDto & {
      email: string;
      role: "ADMIN" | "WORKER";
    }) {
    return this.animalRepository.manager.transaction(
      async (transactionalEntityManager) => {
        let user: Admin | Worker;
        if (role === "ADMIN") {
          user = await this.adminRepository.findOne({
            where: {
              email,
            },
            relations: ["farms.animals.growth_records"],
          });
        } else if (role === "WORKER") {
          user = await this.workerRepository.findOne({
            where: {
              email,
            },
            relations: ["farms.animals.growth_records"],
          });
        }

        if (!user) {
          throw new BadRequestException("User does not exist");
        }

        // find animal from admin farms
        let animal: Animal;

        user.farms.map((farm) => {
          farm.animals.map((anl) => {
            if (anl.tag_number === tagNumber) {
              animal = anl;
            }
          });
        });

        if (!animal) {
          throw new BadRequestException(
            `Animal with tag ${tagNumber} does not belong to this farm`,
          );
        }

        const new_growth_record = new GrowthRecord();
        new_growth_record.period = period;
        new_growth_record.growth_rate = Number(growthRate);
        new_growth_record.notes = notes || "";

        animal.growth_records = [...animal.growth_records, new_growth_record];

        await transactionalEntityManager.save(GrowthRecord, new_growth_record);
        await transactionalEntityManager.save(Animal, animal);

        return {
          message: "Growth record created successfully",
        };
      },
    );
  }

  async addAnimalHealthRecord({
    email,
    role,
    tagNumber,
    issue,
    symptoms,
    diagnosis,
    medication,
    vet_name,
    cost,
    notes,
  }: AddAnimalExpenseRecordParamsDto &
    AddAnimalHealthRecordBodyDto & {
      email: string;
      role: "ADMIN" | "WORKER";
    }) {
    return this.animalRepository.manager.transaction(
      async (transactionalEntityManager) => {
        let user: Admin | Worker;
        if (role === "ADMIN") {
          user = await this.adminRepository.findOne({
            where: {
              email,
            },
            relations: ["farms.animals.health_records"],
          });
        } else if (role === "WORKER") {
          user = await this.workerRepository.findOne({
            where: {
              email,
            },
            relations: ["farms.animals.health_records"],
          });
        }

        if (!user) {
          throw new BadRequestException("User does not exist");
        }

        // find animal from admin farms
        let animal: Animal;

        user.farms.map((farm) => {
          farm.animals.map((anl) => {
            if (anl.tag_number === tagNumber) {
              animal = anl;
            }
          });
        });

        if (!animal) {
          throw new BadRequestException(
            `Animal with tag ${tagNumber} does not belong to this farm`,
          );
        }

        const new_health_record = new HealthRecord();
        new_health_record.cost = cost;
        new_health_record.diagnosis = diagnosis;
        new_health_record.issue = issue;
        new_health_record.medication = medication;
        new_health_record.symptoms = symptoms;
        new_health_record.vet_name = vet_name;
        new_health_record.notes = notes || "";

        animal.health_records = [...animal.health_records, new_health_record];

        await transactionalEntityManager.save(HealthRecord, new_health_record);
        await transactionalEntityManager.save(Animal, animal);

        return {
          message: "Health record created successfully",
        };
      },
    );
  }

  async addAnimalSalesRecord({
    email,
    role,
    tagNumber,
    buyerName,
    saleDate,
    priceSold,
    notes,
  }: AddAnimalExpenseRecordParamsDto &
    AddAnimalSalesRecordBodyDto & { email: string; role: "ADMIN" | "WORKER" }) {
    return this.animalRepository.manager.transaction(
      async (transactionalEntityManager) => {
        let user: Admin | Worker;
        if (role === "ADMIN") {
          user = await this.adminRepository.findOne({
            where: {
              email,
            },
            relations: ["farms.animals.expense_records"],
          });
        } else if (role === "WORKER") {
          user = await this.workerRepository.findOne({
            where: {
              email,
            },
            relations: ["farms.animals.expense_records"],
          });
        }

        if (!user) {
          throw new BadRequestException("User does not exist");
        }

        // find animal from admin farms
        let animal: Animal;
        user.farms.map((farm) => {
          farm.animals.map((anl) => {
            if (anl.tag_number === tagNumber) {
              animal = anl;
            }
          });
        });

        if (!animal) {
          throw new BadRequestException(
            `Animal with tag ${tagNumber} does not belong to this farm`,
          );
        }

        if (animal.sales_record) {
          throw new BadRequestException(
            `Animal with tag ${tagNumber} already has a sales record`,
          );
        }

        // Create new sales record
        const newSalesRecord = new SalesRecord();
        newSalesRecord.buyer_name = buyerName;
        newSalesRecord.sale_date = saleDate;
        newSalesRecord.price_sold = priceSold;
        newSalesRecord.notes = notes || "";
        newSalesRecord.animal = animal;

        // Save the sales record
        await transactionalEntityManager.save(SalesRecord, newSalesRecord);

        // Update the animal to link to the sales record and mark as not available
        animal.sales_record = newSalesRecord;
        animal.available = false;

        // Save the updated animal
        await transactionalEntityManager.save(Animal, animal);

        return {
          message: "Sale record created successfully",
        };
      },
    );
  }

  // GRAPHQL SERVICE METHODS
  async createFarm({
    name,
    email,
    location,
    area,
  }: CreateFarmBodyDto & { email: string }) {
    return this.adminRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const admin = await this.adminRepository.findOne({
          where: {
            email,
          },
          relations: [
            "farms.admin",
            "farms.houses",
            "farms.animals",
            "farms.workers",
          ],
        });

        if (!admin) {
          throw new BadRequestException("Admin does not exist");
        }

        const nameTakenByAdmin = admin.farms.find((fm) => fm.name === name);
        const nameTakenByOtherAdmin = await this.farmRepository.findOne({
          where: {
            name,
          },
        });

        if (nameTakenByAdmin || nameTakenByOtherAdmin) {
          throw new BadRequestException("This name is already in use");
        }

        const farm = new Farm();
        farm.name = name;
        farm.location = location;
        farm.area = area;

        admin.farms.push(farm);
        const savedFarm = await transactionalEntityManager.save(Farm, farm);
        await transactionalEntityManager.save(Admin, admin);

        return {
          ...savedFarm,
          admin: admin,
          message: "Farm created successfully",
        };
      },
    );
  }

  async listFarmsPaginated({
    email,
    role,
    filter,
    searchTerm,
    pagination,
    sort,
  }: {
    email: string;
    role: "ADMIN" | "WORKER";
    filter?: FarmFilterInput;
    searchTerm?: string;
    pagination: PaginationInput;
    sort?: FarmSortInput[];
  }) {
    // First get all farms that match the filter
    const farms = await this.listFarms({ email, role, filter, searchTerm });

    // Sort the farms if sort options are provided
    if (sort && sort.length > 0) {
      this.sortFarms(farms, sort);
    }

    // Apply pagination and return in the connection format
    return this.paginationService.paginate(farms, pagination, (farm) =>
      farm.id.toString(),
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

  async listFarms({
    email,
    role,
    filter,
    searchTerm,
  }: {
    email: string;
    role: "ADMIN" | "WORKER";
    filter?: FarmFilterInput;
    searchTerm?: string;
  }) {
    let user: Admin | Worker;

    // First get the user with their farms
    if (role === "ADMIN") {
      user = await this.adminRepository.findOne({
        where: {
          email,
        },
        relations: [
          "farms.admin.workers",
          "farms.animals",
          "farms.workers",
          "farms.houses.rooms.animals",
          "farms.houses.rooms.animals.breeding_records.animals",
        ],
      });
    } else if (role === "WORKER") {
      user = await this.workerRepository.findOne({
        where: {
          email,
        },
        relations: [
          "farms.admin",
          "farms.animals",
          "farms.workers",
          "farms.houses.rooms",
        ],
      });
    }

    if (!user) {
      throw new BadRequestException("User does not exist");
    }

    let farms = user.farms;

    // Apply searchTerm if provided
    if (searchTerm && searchTerm.trim() !== "") {
      const normalizedSearchTerm = searchTerm.toLowerCase().trim();
      farms = farms.filter((farm) =>
        farm.name.toLowerCase().includes(normalizedSearchTerm),
      );
    }

    // Now apply filters if provided
    if (filter) {
      farms = farms.filter((farm) => {
        // Farm level filters
        if (filter.id && !applyIntFilter(farm.id, filter.id)) {
          return false;
        }

        if (filter.name && !applyStringFilter(farm.name, filter.name)) {
          return false;
        }

        // Admin filters
        if (filter.admin) {
          const admin = farm.admin;
          if (!admin) return false;

          if (filter.admin.id && !applyIntFilter(admin.id, filter.admin.id)) {
            return false;
          }

          if (
            filter.admin.name &&
            !applyStringFilter(admin.name, filter.admin.name)
          ) {
            return false;
          }

          if (
            filter.admin.email &&
            !applyStringFilter(admin.email, filter.admin.email)
          ) {
            return false;
          }
        }

        // Worker filters
        if (filter.worker) {
          const workers = farm.workers || [];
          if (workers.length === 0) return false;

          const matchingWorker = workers.find((worker) => {
            if (
              filter.worker.id &&
              !applyIntFilter(worker.id, filter.worker.id)
            ) {
              return false;
            }

            if (
              filter.worker.name &&
              !applyStringFilter(worker.name, filter.worker.name)
            ) {
              return false;
            }

            if (
              filter.worker.email &&
              !applyStringFilter(worker.email, filter.worker.email)
            ) {
              return false;
            }

            return true;
          });

          if (!matchingWorker) return false;
        }

        // House filters
        if (filter.house) {
          const houses = farm.houses || [];
          if (houses.length === 0) return false;

          const matchingHouse = houses.find((house) => {
            if (filter.house.id && !applyIntFilter(house.id, filter.house.id)) {
              return false;
            }

            if (
              filter.house.house_number &&
              !applyStringFilter(house.house_number, filter.house.house_number)
            ) {
              return false;
            }

            return true;
          });

          if (!matchingHouse) return false;
        }

        // Animal filters
        if (filter.animal) {
          const animals = farm.animals || [];
          if (animals.length === 0) return false;

          const matchingAnimal = animals.find((animal) => {
            if (
              filter.animal.id &&
              !applyIntFilter(animal.id, filter.animal.id)
            ) {
              return false;
            }

            if (
              filter.animal.tag_number &&
              !applyStringFilter(animal.tag_number, filter.animal.tag_number)
            ) {
              return false;
            }

            if (
              filter.animal.gender &&
              !applyStringFilter(animal.gender, filter.animal.gender)
            ) {
              return false;
            }

            if (
              filter.animal.breed &&
              !applyStringFilter(animal.breed, filter.animal.breed)
            ) {
              return false;
            }

            if (
              filter.animal.weight &&
              !applyIntFilter(animal.weight, filter.animal.weight)
            ) {
              return false;
            }

            if (
              filter.animal.health_status &&
              !applyStringFilter(
                animal.health_status,
                filter.animal.health_status,
              )
            ) {
              return false;
            }

            if (
              filter.animal.available &&
              !applyBooleanFilter(animal.available, filter.animal.available)
            ) {
              return false;
            }

            if (
              filter.animal.birth_date &&
              !applyDateFilter(animal.birth_date, filter.animal.birth_date)
            ) {
              return false;
            }

            return true;
          });

          if (!matchingAnimal) return false;
        }

        // Count-based filters
        if (filter.houseCount) {
          const houseCount = farm.houses?.length || 0;
          if (!applyIntFilter(houseCount, filter.houseCount)) return false;
        }

        if (filter.animalCount) {
          const animalCount = farm.animals?.length || 0;
          if (!applyIntFilter(animalCount, filter.animalCount)) return false;
        }

        if (filter.workerCount) {
          const workerCount = farm.workers?.length || 0;
          if (!applyIntFilter(workerCount, filter.workerCount)) return false;
        }

        return true;
      });
    }

    return farms;
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // You can adjust this for stronger hashing
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
}
