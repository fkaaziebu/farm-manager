import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { AnimalType } from "./animal.type";
import { ExpenseCategory } from "src/entities/expense_record.entity";

registerEnumType(ExpenseCategory, {
  name: "ExpenseCategory",
});

@ObjectType("ExpenseRecord")
export class ExpenseRecordType {
  @Field(() => ID)
  id: number;

  @Field(() => ExpenseCategory)
  category: ExpenseCategory;

  @Field()
  expense_date: Date;

  @Field()
  amount: number;

  @Field()
  notes: string;

  @Field(() => AnimalType, { nullable: true })
  animal?: AnimalType;
}
