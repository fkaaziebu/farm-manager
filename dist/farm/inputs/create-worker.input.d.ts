import { WorkerRole } from "src/entities/worker.entity";
export declare class CreateWorkerInput {
    name: string;
    email: string;
    password: string;
    role: WorkerRole;
}
