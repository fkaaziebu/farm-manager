import { Field, InputType } from "@nestjs/graphql";
import { ExpenseCategory } from "../../../database/types/expense-record.type";

@InputType()
export class UpdateExpenseRecordInput {
  @Field()
  amount: number;

  @Field()
  expenseDate: Date;

  @Field(() => ExpenseCategory, { nullable: false })
  category: ExpenseCategory;

  @Field()
  notes: string;
}
