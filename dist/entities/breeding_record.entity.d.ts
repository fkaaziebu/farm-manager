import { Animal } from "./animal.entity";
export declare class BreedingRecord {
    id: number;
    mating_date: Date;
    expected_delivery: Date;
    actual_delivery: Date;
    liter_size: number;
    notes: string;
    status?: string;
    animals: Animal[];
}
