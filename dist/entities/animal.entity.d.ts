import { Farm } from "./farm.entity";
import { BreedingRecord } from "./breeding_record.entity";
import { GrowthRecord } from "./growth_record.entity";
import { ExpenseRecord } from "./expense_record.entity";
import { HealthRecord } from "./health_record.entity";
import { SalesRecord } from "./sales_record.entity";
import { Room } from "./room.entity";
export declare enum FarmAnimalType {
    GRASSCUTTER = "GRASSCUTTER",
    CATTLE = "CATTLE",
    GOAT = "GOAT"
}
export declare enum HealthStatus {
    HEALTHY = "HEALTHY",
    SICK = "SICK",
    TREATED = "TREATED",
    RECOVERING = "RECOVERING",
    CRITICAL = "CRITICAL"
}
export declare class Animal {
    id: number;
    tag_number: string;
    gender: string;
    birth_date: Date;
    type: FarmAnimalType;
    breed: string;
    weight: number;
    health_status: HealthStatus;
    available: boolean;
    direct_parents: Animal[];
    direct_children: Animal[];
    farm: Farm;
    room: Room;
    breeding_records: BreedingRecord[];
    growth_records: GrowthRecord[];
    expense_records: ExpenseRecord[];
    health_records: HealthRecord[];
    sales_record: SalesRecord;
    inserted_at: Date;
    updated_at: Date;
}
