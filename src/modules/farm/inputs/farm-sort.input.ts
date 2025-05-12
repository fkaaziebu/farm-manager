import { Field, InputType, registerEnumType } from "@nestjs/graphql";
import { SortDirection } from "src/database/inputs";

enum FarmSortField {
  ID = "id",
  NAME = "name",
  INSERTED_AT = "insertedAt",
}

registerEnumType(FarmSortField, {
  name: "FarmSortField",
});

@InputType()
export class FarmSortInput {
  @Field(() => FarmSortField)
  field: FarmSortField;

  @Field(() => SortDirection)
  direction: SortDirection;
}
