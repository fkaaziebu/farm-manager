import { Farm } from './farm.entity';
import { Admin } from './admin.entity';
export declare class Worker {
    id: string;
    name: string;
    email: string;
    password: string;
    password_reset_code: string;
    password_reseted: boolean;
    password_reset_date: Date;
    farms: Farm[];
    admin: Admin;
}
