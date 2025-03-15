import { Admin } from './admin.entity';
import { Worker } from './worker.entity';
import { Animal } from './animal.entity';
import { House } from './house.entity';
export declare class Farm {
    id: number;
    name: string;
    admin: Admin;
    workers: Worker[];
    houses: House[];
    animals: Animal[];
}
