"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FarmService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const admin_entity_1 = require("../entities/admin.entity");
const farm_entity_1 = require("../entities/farm.entity");
const house_entity_1 = require("../entities/house.entity");
const room_entity_1 = require("../entities/room.entity");
const animal_entity_1 = require("../entities/animal.entity");
const breeding_record_entity_1 = require("../entities/breeding_record.entity");
const expense_record_entity_1 = require("../entities/expense_record.entity");
const growth_record_entity_1 = require("../entities/growth_record.entity");
const health_record_entity_1 = require("../entities/health_record.entity");
const sales_record_entity_1 = require("../entities/sales_record.entity");
const worker_entity_1 = require("../entities/worker.entity");
const filter_utils_1 = require("./utils/filter-utils");
const pagination_service_1 = require("./pagination/pagination.service");
let FarmService = class FarmService {
    constructor(paginationService, adminRepository, workerRepository, farmRepository, houseRepository, roomRepository, animalRepository) {
        this.paginationService = paginationService;
        this.adminRepository = adminRepository;
        this.workerRepository = workerRepository;
        this.farmRepository = farmRepository;
        this.houseRepository = houseRepository;
        this.roomRepository = roomRepository;
        this.animalRepository = animalRepository;
    }
    async createWorkers({ email, workers, }) {
        return await this.adminRepository.manager.transaction(async (transactionalEntityManager) => {
            const admin = await transactionalEntityManager.findOne(admin_entity_1.Admin, {
                where: { email },
                relations: ["workers"],
            });
            if (!admin) {
                throw new common_1.BadRequestException("Admin does not exist");
            }
            const new_workers = await Promise.all(workers.map(async (worker) => {
                const workerBelongesToAdmin = admin.workers.find((wkr) => wkr.email === worker.email);
                if (workerBelongesToAdmin) {
                    throw new common_1.BadRequestException(`This email has been used for a worker by you, ${worker.email}`);
                }
                const workerBelongesToOtherAdmin = await this.workerRepository.findOne({
                    where: {
                        email: worker.email,
                    },
                });
                if (workerBelongesToOtherAdmin) {
                    throw new common_1.BadRequestException(`This email has been used for a worker by a different admin, ${worker.email}`);
                }
                const new_worker = new worker_entity_1.Worker();
                new_worker.name = worker.name;
                new_worker.email = worker.email;
                new_worker.roles = [worker.role];
                new_worker.password = await this.hashPassword(worker.password);
                return this.workerRepository.save(new_worker);
            }));
            admin.workers = [...new_workers, ...admin.workers];
            await transactionalEntityManager.save(admin_entity_1.Admin, admin);
            return {
                workerIds: new_workers.map((wk) => ({ id: wk.id })),
                message: "Worker(s) created successfully",
            };
        });
    }
    async addFarmWorkers({ email, farmId, workerIds, }) {
        return this.farmRepository.manager.transaction(async (transactionalEntityManager) => {
            const admin = await this.adminRepository.findOne({
                where: {
                    email,
                },
                relations: ["farms.workers", "workers.farms"],
            });
            if (!admin) {
                throw new common_1.BadRequestException("Admin does not exist");
            }
            const farmBelongsToAdmin = admin.farms.find((fm) => fm.id === Number(farmId));
            if (!farmBelongsToAdmin) {
                throw new common_1.BadRequestException(`Admin does not have a farm with id ${farmId}`);
            }
            const workersBelongingToAdmin = admin.workers.filter((wk) => Boolean(workerIds.find((wkId) => wkId.id === wk.id)));
            const newFarmWorkers = workersBelongingToAdmin.filter((newWk) => !farmBelongsToAdmin.workers.find((wk) => wk.id === newWk.id));
            farmBelongsToAdmin.workers = [
                ...farmBelongsToAdmin.workers,
                ...newFarmWorkers,
            ];
            await transactionalEntityManager.save(farm_entity_1.Farm, farmBelongsToAdmin);
            return {
                ...newFarmWorkers[0],
                message: `${newFarmWorkers.length} out of ${workerIds.length} Worker(s) added to farm successfully`,
            };
        });
    }
    async addHousesToFarm({ email, farmId, houses, }) {
        return this.farmRepository.manager.transaction(async (transactionalEntityManager) => {
            const admin = await this.adminRepository.findOne({
                where: {
                    email,
                },
                relations: ["farms.houses"],
            });
            if (!admin) {
                throw new common_1.BadRequestException("Admin does not exist");
            }
            let new_houses = await Promise.all(houses.map(async (house) => {
                const houseBelongsToAdmin = admin.farms
                    .find((fm) => fm.id === Number(farmId))
                    .houses.find((hs) => hs.house_number === house.house_number);
                if (houseBelongsToAdmin) {
                    return null;
                }
                const houseBelongsToOtherAdmin = await this.houseRepository.findOne({
                    where: {
                        house_number: house.house_number,
                    },
                });
                if (houseBelongsToOtherAdmin) {
                    throw new common_1.BadRequestException(`The house number ${house.house_number} has been taken`);
                }
                const new_house = new house_entity_1.House();
                new_house.house_number = house.house_number;
                return this.houseRepository.save(new_house);
            }));
            new_houses = new_houses.filter((hs) => hs);
            const adminFarm = admin.farms.find((fm) => fm.id === Number(farmId));
            adminFarm.houses = [...adminFarm.houses, ...new_houses];
            await transactionalEntityManager.save(farm_entity_1.Farm, adminFarm);
            return {
                message: `${new_houses.length} out of ${houses.length} houses added to farm`,
            };
        });
    }
    async addRoomsToHouse({ email, farmId, houseNumber, rooms, }) {
        return this.houseRepository.manager.transaction(async (transactionalEntityManager) => {
            const admin = await this.adminRepository.findOne({
                where: {
                    email,
                },
                relations: ["farms.houses.rooms"],
            });
            if (!admin) {
                throw new common_1.BadRequestException("Admin does not exist");
            }
            const new_rooms = await Promise.all(rooms.map(async (room) => {
                const roomBelongsToOtherAdmin = await this.roomRepository.findOne({
                    where: {
                        room_number: room.room_number,
                    },
                });
                if (roomBelongsToOtherAdmin) {
                    return;
                }
                const new_room = new room_entity_1.Room();
                new_room.room_number = room.room_number;
                return this.roomRepository.save(new_room);
            }));
            const farmHouse = admin.farms
                .find((fm) => fm.id === Number(farmId))
                .houses.find((hs) => hs.house_number === houseNumber);
            farmHouse.rooms = [
                ...farmHouse.rooms,
                ...new_rooms.filter((rm) => rm?.room_number),
            ];
            const savedResult = await transactionalEntityManager.save(house_entity_1.House, farmHouse);
            return {
                ...savedResult,
                message: "Rooms added to house successfully",
            };
        });
    }
    async addHouseToFarm({ farmId, houseNumber, rooms, email, }) {
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
        }
        catch (err) {
            throw new common_1.BadRequestException(err);
        }
    }
    async addAnimalsToRoom({ email, farmId, houseNumber, roomNumber, animals, }) {
        return this.roomRepository.manager.transaction(async (transactionalEntityManager) => {
            const admin = await this.adminRepository.findOne({
                where: {
                    email,
                },
                relations: ["farms.animals", "farms.houses.rooms.animals"],
            });
            if (!admin) {
                throw new common_1.BadRequestException("Admin does not exist");
            }
            const adminFarm = admin.farms.find((fm) => fm.id === Number(farmId));
            const adminRoom = admin.farms
                .find((fm) => fm.id === Number(farmId))
                ?.houses.find((hs) => hs.house_number === houseNumber)
                ?.rooms.find((rm) => rm.room_number === roomNumber);
            if (!adminRoom) {
                throw new common_1.BadRequestException("Either farm or house or rooms does not belong to admin");
            }
            const new_animals = await Promise.all(animals.map(async (animal) => {
                const animalTagNumberTaken = await this.animalRepository.findOne({
                    where: {
                        tag_number: animal.tag_number,
                    },
                });
                if (animalTagNumberTaken) {
                    throw new common_1.BadRequestException(`The tag number ${animal.tag_number} has been taken`);
                }
                const new_animal = new animal_entity_1.Animal();
                new_animal.tag_number = animal.tag_number;
                new_animal.gender = animal.gender;
                new_animal.birth_date = animal.birth_date;
                new_animal.breed = animal.breed;
                return this.animalRepository.save(new_animal);
            }));
            adminRoom.animals = [...adminRoom.animals, ...new_animals];
            adminFarm.animals = [...adminFarm.animals, ...new_animals];
            await transactionalEntityManager.save(room_entity_1.Room, adminRoom);
            const savedResult = await transactionalEntityManager.save(farm_entity_1.Farm, adminFarm);
            return {
                ...savedResult,
                message: "Animals added to room successfully",
            };
        });
    }
    async addAnimalBreedingRecord({ email, role, maleTagNumber, femaleTagNumber, matingDate, expectedDelivery, }) {
        return this.animalRepository.manager.transaction(async (transactionalEntityManager) => {
            let user;
            if (role === "ADMIN") {
                user = await this.adminRepository.findOne({
                    where: {
                        email,
                    },
                    relations: ["farms.animals.room", "farms.animals.breeding_records"],
                });
            }
            else if (role === "WORKER") {
                user = await this.workerRepository.findOne({
                    where: {
                        email,
                    },
                    relations: ["farms.animals.room", "farms.animals.breeding_records"],
                });
            }
            if (!user) {
                throw new common_1.BadRequestException("User does not exist");
            }
            let maleAnimal;
            let femaleAnimal;
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
                throw new common_1.BadRequestException(`Male with tagNumber ${maleTagNumber} does not belong to this farm`);
            }
            if (!femaleAnimal) {
                throw new common_1.BadRequestException(`Female with tagNumber ${femaleTagNumber} does not belong to this farm`);
            }
            if (maleAnimal.gender === "FEMALE") {
                throw new common_1.BadRequestException(`Animal with tag number ${maleTagNumber} is not a male`);
            }
            if (femaleAnimal.gender === "MALE") {
                throw new common_1.BadRequestException(`Animal with tag number ${femaleTagNumber} is not a female`);
            }
            if (maleAnimal.room.room_number !== femaleAnimal.room.room_number) {
                throw new common_1.BadRequestException("Animals must be in the same room to create a breeding record");
            }
            const maleInProgressRecords = maleAnimal.breeding_records.filter((record) => record.status === "IN_PROGRESS");
            const femaleInProgressRecords = femaleAnimal.breeding_records.filter((record) => record.status === "IN_PROGRESS");
            const commonRecords = maleInProgressRecords.filter((maleRecord) => femaleInProgressRecords.some((femaleRecord) => femaleRecord.id === maleRecord.id));
            if (commonRecords.length > 0) {
                throw new common_1.BadRequestException("These animals already have an in-progress breeding record");
            }
            const new_breeding_record = new breeding_record_entity_1.BreedingRecord();
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
            const savedResult = await transactionalEntityManager.save(breeding_record_entity_1.BreedingRecord, new_breeding_record);
            const savedFemale = await transactionalEntityManager.save(animal_entity_1.Animal, femaleAnimal);
            const savedMale = await transactionalEntityManager.save(animal_entity_1.Animal, maleAnimal);
            return {
                ...savedResult,
                animals: [savedFemale, savedMale],
                message: `Breeding records for ${maleTagNumber} and ${femaleTagNumber} created successfully`,
            };
        });
    }
    async addAnimalExpenseRecord({ email, role, tagNumber, category, expenseDate, amount, notes, }) {
        return this.animalRepository.manager.transaction(async (transactionalEntityManager) => {
            let user;
            if (role === "ADMIN") {
                user = await this.adminRepository.findOne({
                    where: {
                        email,
                    },
                    relations: ["farms.animals.expense_records"],
                });
            }
            else if (role === "WORKER") {
                user = await this.workerRepository.findOne({
                    where: {
                        email,
                    },
                    relations: ["farms.animals.expense_records"],
                });
            }
            if (!user) {
                throw new common_1.BadRequestException("User does not exist");
            }
            let animal;
            user.farms.map((farm) => {
                farm.animals.map((anl) => {
                    if (anl.tag_number === tagNumber) {
                        animal = anl;
                    }
                });
            });
            if (!animal) {
                throw new common_1.BadRequestException(`Animal with tag ${tagNumber} does not belong to this farm`);
            }
            const new_expense_record = new expense_record_entity_1.ExpenseRecord();
            new_expense_record.expense_date = expenseDate;
            new_expense_record.amount = amount;
            new_expense_record.category = category;
            new_expense_record.notes = notes || "";
            animal.expense_records = [
                ...animal.expense_records,
                new_expense_record,
            ];
            await transactionalEntityManager.save(expense_record_entity_1.ExpenseRecord, new_expense_record);
            await transactionalEntityManager.save(animal_entity_1.Animal, animal);
            return {
                message: "Expense record created successfully",
            };
        });
    }
    async addAnimalGrowthRecord({ email, role, tagNumber, period, growthRate, notes, }) {
        return this.animalRepository.manager.transaction(async (transactionalEntityManager) => {
            let user;
            if (role === "ADMIN") {
                user = await this.adminRepository.findOne({
                    where: {
                        email,
                    },
                    relations: ["farms.animals.growth_records"],
                });
            }
            else if (role === "WORKER") {
                user = await this.workerRepository.findOne({
                    where: {
                        email,
                    },
                    relations: ["farms.animals.growth_records"],
                });
            }
            if (!user) {
                throw new common_1.BadRequestException("User does not exist");
            }
            let animal;
            user.farms.map((farm) => {
                farm.animals.map((anl) => {
                    if (anl.tag_number === tagNumber) {
                        animal = anl;
                    }
                });
            });
            if (!animal) {
                throw new common_1.BadRequestException(`Animal with tag ${tagNumber} does not belong to this farm`);
            }
            const new_growth_record = new growth_record_entity_1.GrowthRecord();
            new_growth_record.period = period;
            new_growth_record.growth_rate = Number(growthRate);
            new_growth_record.notes = notes || "";
            animal.growth_records = [...animal.growth_records, new_growth_record];
            await transactionalEntityManager.save(growth_record_entity_1.GrowthRecord, new_growth_record);
            await transactionalEntityManager.save(animal_entity_1.Animal, animal);
            return {
                message: "Growth record created successfully",
            };
        });
    }
    async addAnimalHealthRecord({ email, role, tagNumber, issue, symptoms, diagnosis, medication, vet_name, cost, notes, }) {
        return this.animalRepository.manager.transaction(async (transactionalEntityManager) => {
            let user;
            if (role === "ADMIN") {
                user = await this.adminRepository.findOne({
                    where: {
                        email,
                    },
                    relations: ["farms.animals.health_records"],
                });
            }
            else if (role === "WORKER") {
                user = await this.workerRepository.findOne({
                    where: {
                        email,
                    },
                    relations: ["farms.animals.health_records"],
                });
            }
            if (!user) {
                throw new common_1.BadRequestException("User does not exist");
            }
            let animal;
            user.farms.map((farm) => {
                farm.animals.map((anl) => {
                    if (anl.tag_number === tagNumber) {
                        animal = anl;
                    }
                });
            });
            if (!animal) {
                throw new common_1.BadRequestException(`Animal with tag ${tagNumber} does not belong to this farm`);
            }
            const new_health_record = new health_record_entity_1.HealthRecord();
            new_health_record.cost = cost;
            new_health_record.diagnosis = diagnosis;
            new_health_record.issue = issue;
            new_health_record.medication = medication;
            new_health_record.symptoms = symptoms;
            new_health_record.vet_name = vet_name;
            new_health_record.notes = notes || "";
            animal.health_records = [...animal.health_records, new_health_record];
            await transactionalEntityManager.save(health_record_entity_1.HealthRecord, new_health_record);
            await transactionalEntityManager.save(animal_entity_1.Animal, animal);
            return {
                message: "Health record created successfully",
            };
        });
    }
    async addAnimalSalesRecord({ email, role, tagNumber, buyerName, saleDate, priceSold, notes, }) {
        return this.animalRepository.manager.transaction(async (transactionalEntityManager) => {
            let user;
            if (role === "ADMIN") {
                user = await this.adminRepository.findOne({
                    where: {
                        email,
                    },
                    relations: ["farms.animals.expense_records"],
                });
            }
            else if (role === "WORKER") {
                user = await this.workerRepository.findOne({
                    where: {
                        email,
                    },
                    relations: ["farms.animals.expense_records"],
                });
            }
            if (!user) {
                throw new common_1.BadRequestException("User does not exist");
            }
            let animal;
            user.farms.map((farm) => {
                farm.animals.map((anl) => {
                    if (anl.tag_number === tagNumber) {
                        animal = anl;
                    }
                });
            });
            if (!animal) {
                throw new common_1.BadRequestException(`Animal with tag ${tagNumber} does not belong to this farm`);
            }
            if (animal.sales_record) {
                throw new common_1.BadRequestException(`Animal with tag ${tagNumber} already has a sales record`);
            }
            const newSalesRecord = new sales_record_entity_1.SalesRecord();
            newSalesRecord.buyer_name = buyerName;
            newSalesRecord.sale_date = saleDate;
            newSalesRecord.price_sold = priceSold;
            newSalesRecord.notes = notes || "";
            newSalesRecord.animal = animal;
            await transactionalEntityManager.save(sales_record_entity_1.SalesRecord, newSalesRecord);
            animal.sales_record = newSalesRecord;
            animal.available = false;
            await transactionalEntityManager.save(animal_entity_1.Animal, animal);
            return {
                message: "Sale record created successfully",
            };
        });
    }
    async createFarm({ name, email, location, area, }) {
        return this.adminRepository.manager.transaction(async (transactionalEntityManager) => {
            const admin = await this.adminRepository.findOne({
                where: {
                    email,
                },
                relations: ["farms"],
            });
            if (!admin) {
                throw new common_1.BadRequestException("Admin does not exist");
            }
            const nameTakenByAdmin = admin.farms.find((fm) => fm.name === name);
            const nameTakenByOtherAdmin = await this.farmRepository.findOne({
                where: {
                    name,
                },
            });
            if (nameTakenByAdmin || nameTakenByOtherAdmin) {
                throw new common_1.BadRequestException("This name is already in use");
            }
            const farm = new farm_entity_1.Farm();
            farm.name = name;
            farm.location = location;
            farm.area = area;
            admin.farms.push(farm);
            const savedFarm = await transactionalEntityManager.save(farm_entity_1.Farm, farm);
            await transactionalEntityManager.save(admin_entity_1.Admin, admin);
            return {
                ...savedFarm,
                message: "Farm created successfully",
            };
        });
    }
    async listFarmsPaginated({ email, role, filter, searchTerm, pagination, sort, }) {
        const farms = await this.listFarms({ email, role, filter, searchTerm });
        if (sort && sort.length > 0) {
            this.sortFarms(farms, sort);
        }
        return this.paginationService.paginate(farms, pagination, (farm) => farm.id.toString());
    }
    sortFarms(farms, sortOptions) {
        farms.sort((a, b) => {
            for (const sort of sortOptions) {
                const { field, direction } = sort;
                const multiplier = direction === "ASC" ? 1 : -1;
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
            return a.id - b.id;
        });
    }
    async listFarms({ email, role, filter, searchTerm, }) {
        let user;
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
        }
        else if (role === "WORKER") {
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
            throw new common_1.BadRequestException("User does not exist");
        }
        let farms = user.farms;
        if (searchTerm && searchTerm.trim() !== "") {
            const normalizedSearchTerm = searchTerm.toLowerCase().trim();
            farms = farms.filter((farm) => farm.name.toLowerCase().includes(normalizedSearchTerm));
        }
        if (filter) {
            farms = farms.filter((farm) => {
                if (filter.id && !(0, filter_utils_1.applyIntFilter)(farm.id, filter.id)) {
                    return false;
                }
                if (filter.name && !(0, filter_utils_1.applyStringFilter)(farm.name, filter.name)) {
                    return false;
                }
                if (filter.admin) {
                    const admin = farm.admin;
                    if (!admin)
                        return false;
                    if (filter.admin.id && !(0, filter_utils_1.applyIntFilter)(admin.id, filter.admin.id)) {
                        return false;
                    }
                    if (filter.admin.name &&
                        !(0, filter_utils_1.applyStringFilter)(admin.name, filter.admin.name)) {
                        return false;
                    }
                    if (filter.admin.email &&
                        !(0, filter_utils_1.applyStringFilter)(admin.email, filter.admin.email)) {
                        return false;
                    }
                }
                if (filter.worker) {
                    const workers = farm.workers || [];
                    if (workers.length === 0)
                        return false;
                    const matchingWorker = workers.find((worker) => {
                        if (filter.worker.id &&
                            !(0, filter_utils_1.applyIntFilter)(worker.id, filter.worker.id)) {
                            return false;
                        }
                        if (filter.worker.name &&
                            !(0, filter_utils_1.applyStringFilter)(worker.name, filter.worker.name)) {
                            return false;
                        }
                        if (filter.worker.email &&
                            !(0, filter_utils_1.applyStringFilter)(worker.email, filter.worker.email)) {
                            return false;
                        }
                        return true;
                    });
                    if (!matchingWorker)
                        return false;
                }
                if (filter.house) {
                    const houses = farm.houses || [];
                    if (houses.length === 0)
                        return false;
                    const matchingHouse = houses.find((house) => {
                        if (filter.house.id && !(0, filter_utils_1.applyIntFilter)(house.id, filter.house.id)) {
                            return false;
                        }
                        if (filter.house.house_number &&
                            !(0, filter_utils_1.applyStringFilter)(house.house_number, filter.house.house_number)) {
                            return false;
                        }
                        return true;
                    });
                    if (!matchingHouse)
                        return false;
                }
                if (filter.animal) {
                    const animals = farm.animals || [];
                    if (animals.length === 0)
                        return false;
                    const matchingAnimal = animals.find((animal) => {
                        if (filter.animal.id &&
                            !(0, filter_utils_1.applyIntFilter)(animal.id, filter.animal.id)) {
                            return false;
                        }
                        if (filter.animal.tag_number &&
                            !(0, filter_utils_1.applyStringFilter)(animal.tag_number, filter.animal.tag_number)) {
                            return false;
                        }
                        if (filter.animal.gender &&
                            !(0, filter_utils_1.applyStringFilter)(animal.gender, filter.animal.gender)) {
                            return false;
                        }
                        if (filter.animal.breed &&
                            !(0, filter_utils_1.applyStringFilter)(animal.breed, filter.animal.breed)) {
                            return false;
                        }
                        if (filter.animal.weight &&
                            !(0, filter_utils_1.applyIntFilter)(animal.weight, filter.animal.weight)) {
                            return false;
                        }
                        if (filter.animal.health_status &&
                            !(0, filter_utils_1.applyStringFilter)(animal.health_status, filter.animal.health_status)) {
                            return false;
                        }
                        if (filter.animal.available &&
                            !(0, filter_utils_1.applyBooleanFilter)(animal.available, filter.animal.available)) {
                            return false;
                        }
                        if (filter.animal.birth_date &&
                            !(0, filter_utils_1.applyDateFilter)(animal.birth_date, filter.animal.birth_date)) {
                            return false;
                        }
                        return true;
                    });
                    if (!matchingAnimal)
                        return false;
                }
                if (filter.houseCount) {
                    const houseCount = farm.houses?.length || 0;
                    if (!(0, filter_utils_1.applyIntFilter)(houseCount, filter.houseCount))
                        return false;
                }
                if (filter.animalCount) {
                    const animalCount = farm.animals?.length || 0;
                    if (!(0, filter_utils_1.applyIntFilter)(animalCount, filter.animalCount))
                        return false;
                }
                if (filter.workerCount) {
                    const workerCount = farm.workers?.length || 0;
                    if (!(0, filter_utils_1.applyIntFilter)(workerCount, filter.workerCount))
                        return false;
                }
                return true;
            });
        }
        return farms;
    }
    async hashPassword(password) {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }
};
exports.FarmService = FarmService;
exports.FarmService = FarmService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(admin_entity_1.Admin)),
    __param(2, (0, typeorm_1.InjectRepository)(worker_entity_1.Worker)),
    __param(3, (0, typeorm_1.InjectRepository)(farm_entity_1.Farm)),
    __param(4, (0, typeorm_1.InjectRepository)(house_entity_1.House)),
    __param(5, (0, typeorm_1.InjectRepository)(room_entity_1.Room)),
    __param(6, (0, typeorm_1.InjectRepository)(animal_entity_1.Animal)),
    __metadata("design:paramtypes", [pagination_service_1.PaginationService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], FarmService);
//# sourceMappingURL=farm.service.js.map