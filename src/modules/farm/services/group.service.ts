import { Injectable } from "@nestjs/common";
import { WorkerInput } from "../inputs";

@Injectable()
export class GroupService {
  async createGroup({ name, email }: { name: string; email: string }) {}

  async createAuditor({
    email,
    groupId,
    worker,
  }: {
    email: string;
    groupId: string;
    worker: WorkerInput;
  }) {}

  async requestWorkersToJoinGroup({
    email,
    groupId,
    workerEmails,
  }: {
    email: string;
    groupId: string;
    workerEmails: Array<string>;
  }) {}

  async requestFarmsToJoinGroup({
    email,
    groupId,
    farmTags,
  }: {
    email: string;
    groupId: string;
    farmTags: Array<string>;
  }) {}

  async acceptRequest({
    email,
    requestId,
    role,
  }: {
    email: string;
    requestId: string;
    role: "ADMIN" | "WORKER";
  }) {}
}
