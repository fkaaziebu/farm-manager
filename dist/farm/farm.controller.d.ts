import { FarmService } from "./farm.service";
import { AddAnimalBreedingRecordBodyDto, AddAnimalExpenseRecordBodyDto, AddAnimalExpenseRecordParamsDto, AddAnimalGrowthRecordBodyDto, AddAnimalHealthRecordBodyDto, AddAnimalSalesRecordBodyDto, AddAnimalsToRoomBodyDto, AddAnimalsToRoomParamsDto, AddFarmWorkersBodyDto, AddFarmWorkersParamsDto, AddHousesToFarmBodyDto, AddRoomsToHouseBodyDto, AddRoomsToHouseParamsDto, CreateFarmBodyDto } from "./dto";
export declare class FarmController {
    private readonly farmService;
    constructor(farmService: FarmService);
    createFarm(req: any, createFarmBodyDto: CreateFarmBodyDto): Promise<{
        message: string;
        id: number;
        name: string;
        location: string;
        area: string;
        performance: number;
        admin: import("../entities/admin.entity").Admin;
        workers: import("../entities/worker.entity").Worker[];
        houses: import("../entities/house.entity").House[];
        animals: import("../entities/animal.entity").Animal[];
    }>;
    addFarmWorkers(req: any, addFarmWorkersParamsDto: AddFarmWorkersParamsDto, addFarmWorkersBodyDto: AddFarmWorkersBodyDto): Promise<{
        message: string;
        id: number;
        name: string;
        roles: import("../entities/worker.entity").WorkerRole[];
        email: string;
        password: string;
        token: string;
        role: string;
        password_reset_code: string;
        password_reseted: boolean;
        password_reset_date: Date;
        farms: import("../entities/farm.entity").Farm[];
        admin: import("../entities/admin.entity").Admin;
    }>;
    addHousesToFarm(req: any, addHousesToFarmParamsDto: AddFarmWorkersParamsDto, addHousesToFarmBodyDto: AddHousesToFarmBodyDto): Promise<{
        message: string;
    }>;
    addRoomsToHouse(req: any, addRoomsToHouseParamsDto: AddRoomsToHouseParamsDto, addRoomsToHouseBodyDto: AddRoomsToHouseBodyDto): Promise<{
        message: string;
        id: number;
        house_number: string;
        type: string;
        status: import("../entities/house.entity").HouseStatus;
        farm: import("../entities/farm.entity").Farm;
        rooms: import("../entities/room.entity").Room[];
    }>;
    addAnimalsToRoom(req: any, addAnimalsToRoomParamsDto: AddAnimalsToRoomParamsDto, addAnimalsToRoomBodyDto: AddAnimalsToRoomBodyDto): Promise<{
        message: string;
        id: number;
        name: string;
        location: string;
        area: string;
        performance: number;
        admin: import("../entities/admin.entity").Admin;
        workers: import("../entities/worker.entity").Worker[];
        houses: import("../entities/house.entity").House[];
        animals: import("../entities/animal.entity").Animal[];
    }>;
    addAnimalBreedingRecord(req: any, addAnimalBreedingRecordBodyDto: AddAnimalBreedingRecordBodyDto): Promise<{
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
    addAnimalExpenseRecord(req: any, addAnimalExpenseRecordParamsDto: AddAnimalExpenseRecordParamsDto, addAnimalExpenseRecordBodyDto: AddAnimalExpenseRecordBodyDto): Promise<{
        message: string;
    }>;
    addAnimalGrowthRecord(req: any, addAnimalGrowthRecordParamsDto: AddAnimalExpenseRecordParamsDto, addAnimalGrowthRecordBodyDto: AddAnimalGrowthRecordBodyDto): Promise<{
        message: string;
    }>;
    addAnimalHealthRecord(req: any, addAnimalHealthRecordParamsDto: AddAnimalExpenseRecordParamsDto, addAnimalHealthRecordBodyDto: AddAnimalHealthRecordBodyDto): Promise<{
        message: string;
    }>;
    addAnimalSalesRecord(req: any, addAnimalSalesRecordParamsDto: AddAnimalExpenseRecordParamsDto, addAnimalSalesRecordBodyDto: AddAnimalSalesRecordBodyDto): Promise<{
        message: string;
    }>;
}
