import { Field, InputType, registerEnumType } from "@nestjs/graphql";

enum WorkerSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}

registerEnumType(WorkerSortDirection, {
  name: "WorkerSortDirection",
});

enum WorkerSortField {
  ID = "id",
  NAME = "name",
  INSERTED_AT = "insertedAt",
}

registerEnumType(WorkerSortField, {
  name: "WorkerSortField",
});

@InputType()
export class WorkerSortInput {
  @Field(() => WorkerSortField)
  field: WorkerSortField;

  @Field(() => WorkerSortDirection)
  direction: WorkerSortDirection;
}
