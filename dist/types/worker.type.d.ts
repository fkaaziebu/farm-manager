import { FarmType } from "./farm.type";
import { AdminType } from "./admin.type";
import { WorkerRole } from "src/entities/worker.entity";
export declare class WorkerType {
    id: number;
    name: string;
    email: string;
    role: string;
    token: string;
    roles: WorkerRole[];
    farms?: FarmType[];
    admin?: AdminType;
}
