import { Injectable } from "@nestjs/common";
import { WorkerInput } from "../inputs";

@Injectable()
export class GroupService {
  async createGroup({ name, email }: { name: string; email: string }) {}

  async createAuditor({
    email,
    groupTag,
    worker,
  }: {
    email: string;
    groupTag: string;
    worker: WorkerInput;
  }) {}
}
