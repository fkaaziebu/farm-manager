import { Animal } from './animal.entity';
export declare class BreedingRecord {
    id: string;
    mating_date: Date;
    expected_delivery: Date;
    actual_delivery?: Date;
    liter_size?: number;
    notes: string;
    male: Animal;
    female: Animal;
    animals: Animal[];
}
