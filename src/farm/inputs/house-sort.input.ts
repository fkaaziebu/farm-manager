import { Field, InputType, registerEnumType } from "@nestjs/graphql";

enum HouseSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}

registerEnumType(HouseSortDirection, {
  name: "HouseSortDirection",
});

enum HouseSortField {
  ID = "id",
  NAME = "name",
  INSERTED_AT = "insertedAt",
}

registerEnumType(HouseSortField, {
  name: "HouseSortField",
});

@InputType()
export class HouseSortInput {
  @Field(() => HouseSortField)
  field: HouseSortField;

  @Field(() => HouseSortDirection)
  direction: HouseSortDirection;
}
