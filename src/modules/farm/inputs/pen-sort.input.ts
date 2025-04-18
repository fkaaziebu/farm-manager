import { Field, InputType, registerEnumType } from "@nestjs/graphql";
import { SortDirection } from "./farm-sort.input";

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
