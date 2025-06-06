import { Field, InputType, registerEnumType } from "@nestjs/graphql";
import { SortDirection } from "src/database/inputs";

enum PenSortField {
  ID = "id",
  NAME = "name",
  STATUS = "status",
}

registerEnumType(PenSortField, {
  name: "PenSortField",
});

@InputType()
export class PenSortInput {
  @Field(() => PenSortField)
  field: PenSortField;

  @Field(() => SortDirection)
  direction: SortDirection;
}
