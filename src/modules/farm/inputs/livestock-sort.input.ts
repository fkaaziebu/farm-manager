import { Field, InputType, registerEnumType } from "@nestjs/graphql";
import { SortDirection } from "./farm-sort.input";

enum LivestockSortField {
  ID = "id",
  LIVESTOCK_TYPE = "livestock_type",
}

registerEnumType(LivestockSortField, {
  name: "LivestockSortField",
});

@InputType()
export class LivestockSortInput {
  @Field(() => LivestockSortField)
  field: LivestockSortField;

  @Field(() => SortDirection)
  direction: SortDirection;
}
