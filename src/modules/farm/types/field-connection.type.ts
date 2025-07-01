import { ObjectType } from "@nestjs/graphql";
import { Paginated } from "./pagination.type";
import { FieldType } from "src/database/types";

@ObjectType("FieldConnection")
export class FieldConnection extends Paginated(FieldType) {}
