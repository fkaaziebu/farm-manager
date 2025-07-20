import { Field, InputType, registerEnumType } from "@nestjs/graphql";
import { SortDirection } from "../../../database/inputs";

export enum PredictionSortField {
  INSERTED_AT = "inserted_at",
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
