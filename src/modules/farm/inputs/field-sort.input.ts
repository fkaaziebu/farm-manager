import { Field, InputType, registerEnumType } from "@nestjs/graphql";
import { SortDirection } from "src/database/inputs";

enum FieldSortField {
  ID = "id",
  NAME = "name",
  STATUS = "status",
}

registerEnumType(FieldSortField, {
  name: "FieldSortField",
});

@InputType()
export class FieldSortInput {
  @Field(() => FieldSortField)
  field: FieldSortField;

  @Field(() => SortDirection)
  direction: SortDirection;
}
