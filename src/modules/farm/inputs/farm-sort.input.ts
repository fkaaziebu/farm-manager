import { Field, InputType, registerEnumType } from "@nestjs/graphql";

export enum SortDirection {
  ASC = "ASC",
  DESC = "DESC",
}

registerEnumType(SortDirection, {
  name: "SortDirection",
});

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
