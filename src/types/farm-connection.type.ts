import { ObjectType } from "@nestjs/graphql";
import { FarmType } from "./farm.type";
import { Paginated } from "src/farm/pagination/pagination.type";

@ObjectType("FarmConnection")
export class FarmConnection extends Paginated(FarmType) {}
