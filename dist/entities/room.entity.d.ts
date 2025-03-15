import { House } from './house.entity';
import { Animal } from './animal.entity';
export declare class Room {
    id: string;
    room_number: string;
    house: House;
    animals: Animal[];
}
