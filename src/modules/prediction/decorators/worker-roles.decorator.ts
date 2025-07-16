import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY = "worker_roles";
export const WorkerRoles = (...worker_roles: string[]) =>
  SetMetadata(ROLES_KEY, worker_roles);
