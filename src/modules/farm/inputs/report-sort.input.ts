import { Field, InputType, registerEnumType } from "@nestjs/graphql";
import { SortDirection } from "src/database/inputs";

enum ReportSortField {
  ID = "id",
  NAME = "name",
  STATUS = "status",
}

registerEnumType(ReportSortField, {
  name: "ReportSortField",
});

@InputType()
export class ReportSortInput {
  @Field(() => ReportSortField)
  field: ReportSortField;

  @Field(() => SortDirection)
  direction: SortDirection;
}
