import { Farm } from "./farm.entity";
import { Worker } from "./worker.entity";
export declare class Admin {
    id: number;
    name: string;
    email: string;
    password: string;
    token: string;
    role: string;
    password_reset_code: string;
    password_reseted: boolean;
    password_reset_date: Date;
    farms: Farm[];
    workers: Worker[];
}
