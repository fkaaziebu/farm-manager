import { ObjectType } from "@nestjs/graphql";
import { Paginated } from "./pagination.type";
import { GreenhouseType } from "src/database/types";

@ObjectType("GreenhouseConnection")
export class GreenhouseConnection extends Paginated(GreenhouseType) {}
