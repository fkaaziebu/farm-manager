import { GrowthPeriod } from "src/entities/growth_record.entity";
export declare class AddAnimalGrowthRecordBodyDto {
    period: GrowthPeriod;
    growthRate: number;
    notes?: string;
}
