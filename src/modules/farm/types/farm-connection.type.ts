import { ObjectType } from "@nestjs/graphql";
import { Paginated } from "./pagination.type";
import { FarmTypeClass } from "src/database/types";

@ObjectType("FarmConnection")
export class FarmConnection extends Paginated(FarmTypeClass) {}
