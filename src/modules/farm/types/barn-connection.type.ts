import { ObjectType } from "@nestjs/graphql";
import { Paginated } from "./pagination.type";
import { BarnType } from "src/database/types";

@ObjectType("BarnConnection")
export class BarnConnection extends Paginated(BarnType) {}
