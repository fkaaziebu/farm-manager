import { FarmType } from "./farm.type";
import { WorkerType } from "./worker.type";
export declare class AdminType {
    id: number;
    name: string;
    email: string;
    role: string;
    token: string;
    farms?: FarmType[];
    workers?: WorkerType[];
}
