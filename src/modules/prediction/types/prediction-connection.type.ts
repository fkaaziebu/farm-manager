import { ObjectType } from "@nestjs/graphql";
import { Paginated } from "./pagination.type";
import { PredictionType } from "src/database/types";

@ObjectType("PredictionConnection")
export class PredictionConnection extends Paginated(PredictionType) {}
