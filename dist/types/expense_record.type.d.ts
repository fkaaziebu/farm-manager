import { AnimalType } from "./animal.type";
import { ExpenseCategory } from "src/entities/expense_record.entity";
export declare class ExpenseRecordType {
    id: number;
    category: ExpenseCategory;
    expense_date: Date;
    amount: number;
    notes: string;
    animal?: AnimalType;
}
