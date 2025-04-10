import { Animal } from "./animal.entity";
export declare enum ExpenseCategory {
    FEED = "FEED",
    MEDICAL = "MEDICAL",
    VACCINATION = "VACCINATION",
    BREEDING = "BREEDING",
    IDENTIFICATION = "IDENTIFICATION",
    GROOMING = "GROOMING",
    SUPPLEMENTS = "SUPPLEMENTS",
    TESTING = "TESTING",
    QUARANTINE = "QUARANTINE",
    TRANSPORT = "TRANSPORT",
    SPECIAL_HOUSING = "SPECIAL_HOUSING",
    OTHER = "OTHER"
}
export declare class ExpenseRecord {
    id: number;
    category: ExpenseCategory;
    expense_date: Date;
    amount: number;
    notes: string;
    animal: Animal;
}
