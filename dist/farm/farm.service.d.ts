import { Repository } from "typeorm";
import type { AddAnimalBreedingRecordBodyDto, AddAnimalExpenseRecordBodyDto, AddAnimalExpenseRecordParamsDto, AddAnimalGrowthRecordBodyDto, AddAnimalHealthRecordBodyDto, AddAnimalSalesRecordBodyDto, AddAnimalsToRoomBodyDto, AddAnimalsToRoomParamsDto, AddFarmWorkersBodyDto, AddFarmWorkersParamsDto, AddHousesToFarmBodyDto, AddRoomsToHouseBodyDto, AddRoomsToHouseParamsDto, CreateFarmBodyDto } from "./dto";
import type { FarmFilterInput } from "./inputs/farm-filters.input";
import { Admin } from "../entities/admin.entity";
import { Farm } from "../entities/farm.entity";
import { House } from "../entities/house.entity";
import { Room } from "../entities/room.entity";
import { Animal } from "../entities/animal.entity";
import { Worker, WorkerRole } from "../entities/worker.entity";
import type { PaginationInput } from "./pagination/pagination.type";
import type { FarmSortInput } from "./inputs/farm-sort.input";
import { PaginationService } from "./pagination/pagination.service";
export declare class FarmService {
    private readonly paginationService;
    private adminRepository;
    private workerRepository;
    private farmRepository;
    private houseRepository;
    private roomRepository;
    private animalRepository;
    constructor(paginationService: PaginationService, adminRepository: Repository<Admin>, workerRepository: Repository<Worker>, farmRepository: Repository<Farm>, houseRepository: Repository<House>, roomRepository: Repository<Room>, animalRepository: Repository<Animal>);
    createWorkers({ email, workers, }: {
        email: string;
        workers: Array<{
            name: string;
            email: string;
            role: WorkerRole;
            password: string;
        }>;
    }): Promise<{
        workerIds: {
            id: number;
        }[];
        message: string;
    }>;
    addFarmWorkers({ email, farmId, workerIds, }: AddFarmWorkersParamsDto & AddFarmWorkersBodyDto & {
        email: string;
    }): Promise<{
        message: string;
        id: number;
        name: string;
        roles: WorkerRole[];
        email: string;
        password: string;
        token: string;
        role: string;
        password_reset_code: string;
        password_reseted: boolean;
        password_reset_date: Date;
        farms: Farm[];
        admin: Admin;
    }>;
    addHousesToFarm({ email, farmId, houses, }: AddHousesToFarmBodyDto & AddFarmWorkersParamsDto & {
        email: string;
    }): Promise<{
        message: string;
    }>;
    addRoomsToHouse({ email, farmId, houseNumber, rooms, }: AddRoomsToHouseParamsDto & AddRoomsToHouseBodyDto & {
        email: string;
    }): Promise<{
        message: string;
        id: number;
        house_number: string;
        type: string;
        status: import("../entities/house.entity").HouseStatus;
        farm: Farm;
        rooms: Room[];
    }>;
    addHouseToFarm({ farmId, houseNumber, rooms, email, }: AddRoomsToHouseParamsDto & AddRoomsToHouseBodyDto & {
        email: string;
    }): Promise<{
        message: string;
        id: number;
        house_number: string;
        type: string;
        status: import("../entities/house.entity").HouseStatus;
        farm: Farm;
        rooms: Room[];
    }>;
    addAnimalsToRoom({ email, farmId, houseNumber, roomNumber, animals, }: AddAnimalsToRoomParamsDto & AddAnimalsToRoomBodyDto & {
        email: string;
    }): Promise<{
        message: string;
        id: number;
        name: string;
        location: string;
        area: string;
        performance: number;
        admin: Admin;
        workers: Worker[];
        houses: House[];
        animals: Animal[];
    }>;
    addAnimalBreedingRecord({ email, role, maleTagNumber, femaleTagNumber, matingDate, expectedDelivery, }: AddAnimalBreedingRecordBodyDto & {
        email: string;
        role: "WORKER" | "ADMIN";
    }): Promise<{
        animals: Animal[];
        message: string;
        id: number;
        mating_date: Date;
        expected_delivery: Date;
        actual_delivery: Date;
        liter_size: number;
        notes: string;
        status?: string;
    }>;
    addAnimalExpenseRecord({ email, role, tagNumber, category, expenseDate, amount, notes, }: AddAnimalExpenseRecordParamsDto & AddAnimalExpenseRecordBodyDto & {
        email: string;
        role: "ADMIN" | "WORKER";
    }): Promise<{
        message: string;
    }>;
    addAnimalGrowthRecord({ email, role, tagNumber, period, growthRate, notes, }: AddAnimalExpenseRecordParamsDto & AddAnimalGrowthRecordBodyDto & {
        email: string;
        role: "ADMIN" | "WORKER";
    }): Promise<{
        message: string;
    }>;
    addAnimalHealthRecord({ email, role, tagNumber, issue, symptoms, diagnosis, medication, vet_name, cost, notes, }: AddAnimalExpenseRecordParamsDto & AddAnimalHealthRecordBodyDto & {
        email: string;
        role: "ADMIN" | "WORKER";
    }): Promise<{
        message: string;
    }>;
    addAnimalSalesRecord({ email, role, tagNumber, buyerName, saleDate, priceSold, notes, }: AddAnimalExpenseRecordParamsDto & AddAnimalSalesRecordBodyDto & {
        email: string;
        role: "ADMIN" | "WORKER";
    }): Promise<{
        message: string;
    }>;
    createFarm({ name, email, location, area, }: CreateFarmBodyDto & {
        email: string;
    }): Promise<{
        message: string;
        id: number;
        name: string;
        location: string;
        area: string;
        performance: number;
        admin: Admin;
        workers: Worker[];
        houses: House[];
        animals: Animal[];
    }>;
    listFarmsPaginated({ email, role, filter, searchTerm, pagination, sort, }: {
        email: string;
        role: "ADMIN" | "WORKER";
        filter?: FarmFilterInput;
        searchTerm?: string;
        pagination: PaginationInput;
        sort?: FarmSortInput[];
    }): Promise<{
        edges: {
            cursor: string;
            node: Farm;
        }[];
        pageInfo: {
            hasNextPage: boolean;
            hasPreviousPage: boolean;
            startCursor: string;
            endCursor: string;
        };
        count: number;
    }>;
    private sortFarms;
    listFarms({ email, role, filter, searchTerm, }: {
        email: string;
        role: "ADMIN" | "WORKER";
        filter?: FarmFilterInput;
        searchTerm?: string;
    }): Promise<Farm[]>;
    private hashPassword;
}
