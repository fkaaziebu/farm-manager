declare enum WorkerSortDirection {
    ASC = "ASC",
    DESC = "DESC"
}
declare enum WorkerSortField {
    ID = "id",
    NAME = "name",
    INSERTED_AT = "insertedAt"
}
export declare class WorkerSortInput {
    field: WorkerSortField;
    direction: WorkerSortDirection;
}
export {};
