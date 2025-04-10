import { RoomType } from "./room.type";
import { FarmType } from "./farm.type";
import { HouseStatus } from "src/entities/house.entity";
export declare class HouseType {
    id: number;
    house_number: string;
    type: string;
    status: HouseStatus;
    farm?: FarmType;
    rooms?: RoomType[];
}
