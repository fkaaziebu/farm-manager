import { Field, InputType, registerEnumType } from "@nestjs/graphql";
import { SortDirection } from "src/database/inputs";

enum PredictionSortField {
  INSERTED_AT = "insertedAt",
}

registerEnumType(PredictionSortField, {
  name: "PredictionSortField",
});

@InputType()
export class PredictionSortInput {
  @Field(() => PredictionSortField)
  field: PredictionSortField;

  @Field(() => SortDirection)
  direction: SortDirection;
}
