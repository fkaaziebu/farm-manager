import { ObjectType } from "@nestjs/graphql";
import { Paginated } from "./pagination.type";
import { PenType } from "src/database/types";

@ObjectType("PenConnection")
export class PenConnection extends Paginated(PenType) {}
