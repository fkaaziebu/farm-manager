declare enum SortDirection {
    ASC = "ASC",
    DESC = "DESC"
}
declare enum FarmSortField {
    ID = "id",
    NAME = "name",
    INSERTED_AT = "insertedAt"
}
export declare class FarmSortInput {
    field: FarmSortField;
    direction: SortDirection;
}
export {};
