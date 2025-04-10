import { Room } from "./room.entity";
import { Farm } from "./farm.entity";
export declare enum HouseStatus {
    OPERATIONAL = "OPERATIONAL",
    MAINTENANCE = "MAINTENANCE"
}
export declare class House {
    id: number;
    house_number: string;
    type: string;
    status: HouseStatus;
    farm: Farm;
    rooms: Room[];
}
