import { Field, InputType, registerEnumType } from "@nestjs/graphql";
import { SortDirection } from "src/database/inputs";

enum GreenhouseSortField {
  ID = "id",
  NAME = "name",
  STATUS = "status",
}

registerEnumType(GreenhouseSortField, {
  name: "GreenhouseSortField",
});

@InputType()
export class GreenhouseSortInput {
  @Field(() => GreenhouseSortField)
  field: GreenhouseSortField;

  @Field(() => SortDirection)
  direction: SortDirection;
}
