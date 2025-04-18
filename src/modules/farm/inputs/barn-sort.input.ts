import { Field, InputType, registerEnumType } from "@nestjs/graphql";
import { SortDirection } from "./farm-sort.input";

enum BarnSortField {
  ID = "id",
  NAME = "name",
  STATUS = "status",
}

registerEnumType(BarnSortField, {
  name: "BarnSortField",
});

@InputType()
export class BarnSortInput {
  @Field(() => BarnSortField)
  field: BarnSortField;

  @Field(() => SortDirection)
  direction: SortDirection;
}
