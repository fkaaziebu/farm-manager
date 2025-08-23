import { ObjectType } from "@nestjs/graphql";
import { IamType } from "src/database/types";
import { Paginated } from "./pagination.type";

@ObjectType("IamConnection")
export class IamConnection extends Paginated(IamType) {}
