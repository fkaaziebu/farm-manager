declare enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE"
}
export declare class CreateAnimalInput {
    tag_number: string;
    birth_date: Date;
    breed: string;
    gender: Gender;
}
export {};
