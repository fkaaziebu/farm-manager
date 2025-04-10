import { AdminType } from "./admin.type";
import { WorkerType } from "./worker.type";
export declare class AdminTokenType {
    user: AdminType;
    role: string;
    token: string;
}
export declare class WorkerTokenType {
    user: WorkerType;
    role: string;
    token: string;
}
