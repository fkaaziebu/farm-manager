import { IntFilterInput } from "./int-filter.input";
import { StringFilterInput } from "./string-filter.input";
import { BooleanFilterInput } from "./boolean-filter.input";
import { DateFilterInput } from "./date-filter.input";
export declare class AdminFilterInput {
    id?: IntFilterInput;
    name?: StringFilterInput;
    email?: StringFilterInput;
}
export declare class WorkerFilterInput {
    id?: IntFilterInput;
    name?: StringFilterInput;
    email?: StringFilterInput;
}
export declare class HouseFilterInput {
    id?: IntFilterInput;
    house_number?: StringFilterInput;
}
export declare class RoomFilterInput {
    id?: IntFilterInput;
    room_number?: StringFilterInput;
}
export declare class AnimalFilterInput {
    id?: IntFilterInput;
    tag_number?: StringFilterInput;
    gender?: StringFilterInput;
    birth_date?: DateFilterInput;
    breed?: StringFilterInput;
    weight?: IntFilterInput;
    health_status?: StringFilterInput;
    available?: BooleanFilterInput;
}
export declare class FarmFilterInput {
    id?: IntFilterInput;
    name?: StringFilterInput;
    admin?: AdminFilterInput;
    worker?: WorkerFilterInput;
    house?: HouseFilterInput;
    animal?: AnimalFilterInput;
    houseCount?: IntFilterInput;
    animalCount?: IntFilterInput;
    workerCount?: IntFilterInput;
}
