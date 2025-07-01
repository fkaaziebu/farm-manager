import { Field, InputType } from "@nestjs/graphql";
import { CropType } from "src/database/types/crop-batch.type";

@InputType()
export class CropBatchFilterInput {
  @Field(() => CropType, { nullable: true })
  crop_type?: CropType;
}
