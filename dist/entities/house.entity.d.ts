import { Room } from './room.entity';
import { Farm } from './farm.entity';
export declare class House {
    id: string;
    house_number: string;
    farm: Farm;
    rooms: Room[];
}
