import { Farm } from "./farm.entity";
import { Admin } from "./admin.entity";
export declare enum WorkerRole {
    FARM_MANAGER = "FARM_MANAGER",
    VETERINARIAN = "VETERINARIAN",
    FEED_SPECIALIST = "FEED_SPECIALIST",
    ANIMAL_CARETAKER = "ANIMAL_CARETAKER"
}
export declare class Worker {
    id: number;
    name: string;
    roles: WorkerRole[];
    email: string;
    password: string;
    token: string;
    role: string;
    password_reset_code: string;
    password_reseted: boolean;
    password_reset_date: Date;
    farms: Farm[];
    admin: Admin;
}
