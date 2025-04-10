declare enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE"
}
export declare class AnimalDto {
    tag_number: string;
    gender: Gender;
    birth_date: Date;
    breed: string;
}
export declare class AddAnimalsToRoomBodyDto {
    animals: AnimalDto[];
}
export {};
