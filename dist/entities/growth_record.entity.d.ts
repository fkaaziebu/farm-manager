import { Animal } from "./animal.entity";
export declare enum GrowthPeriod {
    BIRTH = "BIRTH",
    FOUR_WEEKS = "4_WEEKS",
    EIGHT_WEEKS = "8_WEEKS",
    ADULTHOOD = "ADULTHOOD"
}
export declare class GrowthRecord {
    id: number;
    period: GrowthPeriod;
    growth_rate: number;
    notes: string;
    animal: Animal;
}
