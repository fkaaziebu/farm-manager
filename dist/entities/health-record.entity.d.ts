import { Animal } from './animal.entity';
export declare class HealthRecord {
    id: string;
    issue: string;
    symptoms: string;
    diagnosis: string;
    medication: string;
    vet_name: string;
    cost: number;
    notes: string;
    animal: Animal;
}
