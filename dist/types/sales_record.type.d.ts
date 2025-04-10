import { AnimalType } from "./animal.type";
export declare class SalesRecordType {
    id: number;
    buyer_name: string;
    sale_date: Date;
    price_sold: number;
    expenses?: number;
    notes: string;
    animal?: AnimalType;
}
