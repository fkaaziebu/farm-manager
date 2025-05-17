import { ObjectType } from "@nestjs/graphql";
import { Paginated } from "./pagination.type";
import { GroupType } from "src/database/types";

@ObjectType("GroupConnection")
export class GroupConnection extends Paginated(GroupType) {}
