import { ObjectType } from "@nestjs/graphql";
import { Paginated } from "./pagination.type";
import { LivestockTypeClass } from "src/database/types";

@ObjectType("LivestockConnection")
export class LivestockConnection extends Paginated(LivestockTypeClass) {}
