declare enum AnimalSortDirection {
    ASC = "ASC",
    DESC = "DESC"
}
declare enum AnimalSortField {
    ID = "id",
    NAME = "name",
    INSERTED_AT = "insertedAt"
}
export declare class AnimalSortInput {
    field: AnimalSortField;
    direction: AnimalSortDirection;
}
export {};
