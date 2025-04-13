import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Queue } from "bullmq";

@Injectable()
export class EmailProducer {
  constructor(@InjectQueue("farm-queue") private readonly farmQueue: Queue) {}

  async sendPasswordResetEmail(data: {
    email: string;
    name: string;
    resetCode: string;
    role: string;
  }) {
    await this.farmQueue.add("send-password-reset", data);
  }
}
