import { ExpenseCategory } from "src/entities/expense_record.entity";
export declare class AddAnimalExpenseRecordBodyDto {
    category: ExpenseCategory;
    expenseDate: Date;
    amount: number;
    notes?: string;
}
