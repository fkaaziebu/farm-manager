import { AnimalType } from "./animal.type";
export declare class HealthRecordType {
    id: number;
    issue: string;
    symptoms: string;
    diagnosis: string;
    medication: string;
    vet_name: string;
    cost: number;
    notes: string;
    animal?: AnimalType;
}
