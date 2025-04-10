import { Field, InputType, registerEnumType } from "@nestjs/graphql";

enum AnimalSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}

registerEnumType(AnimalSortDirection, {
  name: "AnimalSortDirection",
});

enum AnimalSortField {
  ID = "id",
  NAME = "name",
  INSERTED_AT = "insertedAt",
}

registerEnumType(AnimalSortField, {
  name: "AnimalSortField",
});

@InputType()
export class AnimalSortInput {
  @Field(() => AnimalSortField)
  field: AnimalSortField;

  @Field(() => AnimalSortDirection)
  direction: AnimalSortDirection;
}
