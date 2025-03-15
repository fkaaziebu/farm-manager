import { Animal } from './animal.entity';
export declare class GrowthRecord {
    id: string;
    period: string;
    growth_rate?: number;
    animal: Animal;
}
