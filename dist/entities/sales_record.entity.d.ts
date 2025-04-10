import { Animal } from "./animal.entity";
export declare class SalesRecord {
    id: number;
    buyer_name: string;
    sale_date: Date;
    price_sold: number;
    expenses: number;
    notes: string;
    animal: Animal;
}
