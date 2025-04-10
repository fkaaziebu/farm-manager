import { PaginationInput } from "./pagination.type";
export declare class PaginationService {
    paginate<T>(items: T[], paginationInput: PaginationInput, cursorExtractor: (item: T) => string | number): {
        edges: {
            cursor: string;
            node: T;
        }[];
        pageInfo: {
            hasNextPage: boolean;
            hasPreviousPage: boolean;
            startCursor: string;
            endCursor: string;
        };
        count: number;
    };
    encodeCursor(cursor: string): string;
    decodeCursor(cursor: string): string;
}
