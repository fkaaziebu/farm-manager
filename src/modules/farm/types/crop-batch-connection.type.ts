import { ObjectType } from "@nestjs/graphql";
import { Paginated } from "./pagination.type";
import { CropBatchType } from "src/database/types";

@ObjectType("CropBatchConnection")
export class CropBatchConnection extends Paginated(CropBatchType) {}
