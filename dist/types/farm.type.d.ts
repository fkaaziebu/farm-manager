import { AdminType } from "./admin.type";
import { WorkerType } from "./worker.type";
import { AnimalType } from "./animal.type";
import { HouseType } from "./house.type";
export declare class FarmType {
    id: number;
    name: string;
    location: string;
    area: string;
    performance: number;
    admin?: AdminType;
    workers?: WorkerType[];
    houses?: HouseType[];
    animals?: AnimalType[];
}
