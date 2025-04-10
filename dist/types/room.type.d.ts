import { HouseType } from "./house.type";
import { AnimalType } from "./animal.type";
export declare class RoomType {
    id: number;
    room_number: string;
    house?: HouseType;
    animals?: AnimalType[];
}
