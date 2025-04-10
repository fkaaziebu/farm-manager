import { FarmService } from "./farm.service";
import { PaginationInput } from "./pagination/pagination.type";
import { FarmSortInput } from "./inputs/farm-sort.input";
import { AnimalFilterInput, FarmFilterInput, HouseFilterInput, WorkerFilterInput } from "./inputs/farm-filters.input";
import { WorkerSortInput } from "./inputs/worker-sort.input";
import { Farm } from "src/entities/farm.entity";
import { AnimalSortInput } from "./inputs/animal-sort.input";
import { HouseSortInput } from "./inputs/house-sort.input";
import type { WorkerRole } from "src/entities/worker.entity";
import { WorkerIdInput } from "./inputs/worker-id.input";
import { CreateWorkerInput } from "./inputs/create-worker.input";
import { CreateAnimalInput } from "./inputs/create-animal.input";
import { CreateRoomInput } from "./inputs/create-room.input";
import { GrowthPeriod } from "src/entities/growth_record.entity";
import { ExpenseCategory } from "src/entities/expense_record.entity";
export declare class FarmResolver {
    private readonly farmService;
    constructor(farmService: FarmService);
    listFarms(context: any, filter?: FarmFilterInput, searchTerm?: string, pagination?: PaginationInput, sort?: FarmSortInput[]): Promise<{
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
    getWorkers(farm: Farm, filter?: WorkerFilterInput, pagination?: PaginationInput, sort?: WorkerSortInput[]): Promise<import("src/entities/worker.entity").Worker[]>;
    getAnimals(farm: Farm, filter?: AnimalFilterInput, pagination?: PaginationInput, sort?: AnimalSortInput[]): Promise<import("../entities/animal.entity").Animal[]>;
    getHouses(farm: Farm, filter?: HouseFilterInput, pagination?: PaginationInput, sort?: HouseSortInput[]): Promise<import("../entities/house.entity").House[]>;
    createFarm(context: any, name: string, location: string, area: string): Promise<{
        message: string;
        id: number;
        name: string;
        location: string;
        area: string;
        performance: number;
        admin: import("../entities/admin.entity").Admin;
        workers: import("src/entities/worker.entity").Worker[];
        houses: import("../entities/house.entity").House[];
        animals: import("../entities/animal.entity").Animal[];
    }>;
    addWorkersToFarm(context: any, farmId: string, workerIds?: WorkerIdInput[]): Promise<{
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
        admin: import("../entities/admin.entity").Admin;
    }>;
    createAndAddWorkerToFarm(context: any, farmId: string, workers?: CreateWorkerInput[]): Promise<{
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
        admin: import("../entities/admin.entity").Admin;
    }>;
    addHouseToFarm(context: any, farmId: string, houseNumber: string, rooms: CreateRoomInput[]): Promise<{
        message: string;
        id: number;
        house_number: string;
        type: string;
        status: import("../entities/house.entity").HouseStatus;
        farm: Farm;
        rooms: import("../entities/room.entity").Room[];
    }>;
    addAnimalsToFarm(context: any, farmId: string, houseNumber: string, roomNumber: string, animals: CreateAnimalInput[]): Promise<{
        message: string;
        id: number;
        name: string;
        location: string;
        area: string;
        performance: number;
        admin: import("../entities/admin.entity").Admin;
        workers: import("src/entities/worker.entity").Worker[];
        houses: import("../entities/house.entity").House[];
        animals: import("../entities/animal.entity").Animal[];
    }>;
    addAnimalBreedingRecord(context: any, maleTagNumber: string, femaleTagNumber: string, matingDate: Date, expectedDelivery: Date): Promise<{
        animals: import("../entities/animal.entity").Animal[];
        message: string;
        id: number;
        mating_date: Date;
        expected_delivery: Date;
        actual_delivery: Date;
        liter_size: number;
        notes: string;
        status?: string;
    }>;
    addAnimalHealthRecord(context: any, tagNumber: string, issue: string, symptoms: string, diagnosis: string, medication: string, vet_name: string, cost: number, notes: string): Promise<{
        message: string;
    }>;
    addAnimalGrowthRecord(context: any, tagNumber: string, period: GrowthPeriod, growthRate: number, notes: string): Promise<{
        message: string;
    }>;
    addAnimalExpenseRecord(context: any, tagNumber: string, category: ExpenseCategory, expenseDate: Date, amount: number, notes: string): Promise<{
        message: string;
    }>;
    addAnimalSalesRecord(context: any, tagNumber: string, buyerName: string, saleDate: Date, priceSold: number, notes: string): Promise<{
        message: string;
    }>;
}
