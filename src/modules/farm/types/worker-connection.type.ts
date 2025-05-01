import { ObjectType } from "@nestjs/graphql";
import { Paginated } from "./pagination.type";
import { WorkerType } from "src/database/types";

@ObjectType("WorkerConnection")
export class WorkerConnection extends Paginated(WorkerType) {}
