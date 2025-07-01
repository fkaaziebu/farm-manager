import { Field, InputType, registerEnumType } from "@nestjs/graphql";
import { SortDirection } from "src/database/inputs";

enum CropBatchSortField {
  ID = "id",
  NAME = "name",
  STATUS = "status",
}

registerEnumType(CropBatchSortField, {
  name: "CropBatchSortField",
});

@InputType()
export class CropBatchSortInput {
  @Field(() => CropBatchSortField)
  field: CropBatchSortField;

  @Field(() => SortDirection)
  direction: SortDirection;
}
