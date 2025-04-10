import { Type } from "@nestjs/common";
export declare class PageInfo {
    startCursor?: string;
    endCursor?: string;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}
export declare function Paginated<T>(classRef: Type<T>): Type<any>;
export declare class PaginationInput {
    first?: number;
    after?: string;
    last?: number;
    before?: string;
}
export declare class SortInput {
    field: string;
    direction: "ASC" | "DESC";
}
