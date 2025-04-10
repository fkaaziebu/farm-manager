import { Queue } from "bullmq";
export declare class EmailProducer {
    private readonly emailQueue;
    constructor(emailQueue: Queue);
    sendPasswordResetEmail(data: {
        email: string;
        name: string;
        resetCode: string;
        role: string;
    }): Promise<void>;
}
