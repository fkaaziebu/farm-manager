import { ObjectType } from "@nestjs/graphql";
import { Paginated } from "./pagination.type";
import { ReportType } from "src/database/types";

@ObjectType("ReportConnection")
export class ReportConnection extends Paginated(ReportType) {}
