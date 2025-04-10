import { AnimalType } from "./animal.type";
import { GrowthPeriod } from "src/entities/growth_record.entity";
export declare class GrowthRecordType {
    id: number;
    period: GrowthPeriod;
    growth_rate?: number;
    notes: string;
    animal?: AnimalType;
}
