declare enum HouseSortDirection {
    ASC = "ASC",
    DESC = "DESC"
}
declare enum HouseSortField {
    ID = "id",
    NAME = "name",
    INSERTED_AT = "insertedAt"
}
export declare class HouseSortInput {
    field: HouseSortField;
    direction: HouseSortDirection;
}
export {};
