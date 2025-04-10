"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationService = void 0;
const common_1 = require("@nestjs/common");
let PaginationService = class PaginationService {
    paginate(items, paginationInput = {}, cursorExtractor) {
        const { first, after, last, before } = paginationInput;
        const defaultFirst = 10;
        let limit = first || defaultFirst;
        let afterIndex = -1;
        let beforeIndex = items.length;
        if (after) {
            const decodedCursor = this.decodeCursor(after);
            afterIndex = items.findIndex((item) => String(cursorExtractor(item)) === decodedCursor);
            if (afterIndex === -1)
                afterIndex = -1;
            else
                afterIndex = afterIndex;
        }
        if (before) {
            const decodedCursor = this.decodeCursor(before);
            beforeIndex = items.findIndex((item) => String(cursorExtractor(item)) === decodedCursor);
            if (beforeIndex === -1)
                beforeIndex = items.length;
            else
                beforeIndex = beforeIndex;
        }
        if (last) {
            const potentialCount = beforeIndex - afterIndex - 1;
            if (potentialCount > last) {
                afterIndex = beforeIndex - last - 1;
            }
            limit = last;
        }
        const slicedItems = items.slice(afterIndex + 1, beforeIndex);
        const paginatedItems = slicedItems.slice(0, limit);
        const edges = paginatedItems.map((item) => ({
            cursor: this.encodeCursor(String(cursorExtractor(item))),
            node: item,
        }));
        const hasNextPage = beforeIndex > afterIndex + 1 + paginatedItems.length;
        const hasPreviousPage = afterIndex >= 0;
        const pageInfo = {
            hasNextPage,
            hasPreviousPage,
            startCursor: edges.length > 0 ? edges[0].cursor : null,
            endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
        };
        return {
            edges,
            pageInfo,
            count: items.length,
        };
    }
    encodeCursor(cursor) {
        return Buffer.from(cursor).toString("base64");
    }
    decodeCursor(cursor) {
        return Buffer.from(cursor, "base64").toString("utf-8");
    }
};
exports.PaginationService = PaginationService;
exports.PaginationService = PaginationService = __decorate([
    (0, common_1.Injectable)()
], PaginationService);
//# sourceMappingURL=pagination.service.js.map