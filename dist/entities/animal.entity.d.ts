import { Farm } from './farm.entity';
import { BreedingRecord } from './breeding-record.entity';
import { GrowthRecord } from './growth-record.entity';
import { ExpenseRecord } from './expense-record.entity';
import { HealthRecord } from './health-record.entity';
import { SalesRecord } from './sales-record.entity';
import { Room } from './room.entity';
export declare class Animal {
    id: string;
    tag_number: string;
    gender: string;
    birth_date: Date;
    breed: string;
    weight?: number;
    health_status?: string;
    available: boolean;
    direct_parents?: Animal[];
    direct_children?: Animal[];
    farm: Farm;
    room: Room;
    breeding_records: BreedingRecord[];
    growth_records: GrowthRecord[];
    expense_records: ExpenseRecord[];
    health_records: HealthRecord[];
    sales_record: SalesRecord;
}
