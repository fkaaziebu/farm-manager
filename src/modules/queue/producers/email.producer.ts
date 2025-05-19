import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Queue } from "bullmq";
import { RequestType } from "src/database/types";

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

  async sendGroupJoinRequest(data: {
    email: string;
    name: string;
    request_id: string;
    type: RequestType;
  }) {
    await this.farmQueue.add("send-group-join-request", data);
  }
}
