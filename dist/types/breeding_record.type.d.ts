import { AnimalType } from "./animal.type";
declare enum BreedingStatus {
    IN_PROGRESS = "IN_PROGRESS",
    SUCCESSFUL = "SUCCESSFUL",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED"
}
export declare class BreedingRecordType {
    id: number;
    mating_date: Date;
    expected_delivery: Date;
    actual_delivery?: Date;
    liter_size?: number;
    notes?: string;
    status: BreedingStatus;
    animals?: AnimalType[];
}
export {};
