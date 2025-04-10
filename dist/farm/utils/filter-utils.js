"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyIntFilter = applyIntFilter;
exports.applyStringFilter = applyStringFilter;
exports.applyBooleanFilter = applyBooleanFilter;
exports.applyDateFilter = applyDateFilter;
function applyIntFilter(value, filter) {
    if (!filter)
        return true;
    if (filter.isNil !== undefined) {
        if (filter.isNil && value !== null && value !== undefined)
            return false;
        if (!filter.isNil && (value === null || value === undefined))
            return false;
    }
    if (value === null || value === undefined)
        return true;
    if (filter.eq !== undefined && value !== filter.eq)
        return false;
    if (filter.notEq !== undefined && value === filter.notEq)
        return false;
    if (filter.greaterThan !== undefined && value <= filter.greaterThan)
        return false;
    if (filter.greaterThanOrEqual !== undefined &&
        value < filter.greaterThanOrEqual)
        return false;
    if (filter.lessThan !== undefined && value >= filter.lessThan)
        return false;
    if (filter.lessThanOrEqual !== undefined && value > filter.lessThanOrEqual)
        return false;
    if (filter.in !== undefined &&
        Array.isArray(filter.in) &&
        !filter.in.includes(value))
        return false;
    return true;
}
function applyStringFilter(value, filter) {
    if (!filter)
        return true;
    if (filter.isNil !== undefined) {
        if (filter.isNil && value !== null && value !== undefined)
            return false;
        if (!filter.isNil && (value === null || value === undefined))
            return false;
    }
    if (value === null || value === undefined)
        return true;
    if (filter.eq !== undefined && value !== filter.eq)
        return false;
    if (filter.notEq !== undefined && value === filter.notEq)
        return false;
    if (filter.contains !== undefined &&
        !value.toLowerCase().includes(filter.contains.toLowerCase()))
        return false;
    if (filter.startsWith !== undefined &&
        !value.toLowerCase().startsWith(filter.startsWith.toLowerCase()))
        return false;
    if (filter.endsWith !== undefined &&
        !value.toLowerCase().endsWith(filter.endsWith.toLowerCase()))
        return false;
    if (filter.in !== undefined &&
        Array.isArray(filter.in) &&
        !filter.in.includes(value))
        return false;
    return true;
}
function applyBooleanFilter(value, filter) {
    if (!filter)
        return true;
    if (filter.isNil !== undefined) {
        if (filter.isNil && value !== null && value !== undefined)
            return false;
        if (!filter.isNil && (value === null || value === undefined))
            return false;
    }
    if (value === null || value === undefined)
        return true;
    if (filter.eq !== undefined && value !== filter.eq)
        return false;
    return true;
}
function applyDateFilter(value, filter) {
    if (!filter)
        return true;
    if (filter.isNil !== undefined) {
        if (filter.isNil && value !== null && value !== undefined)
            return false;
        if (!filter.isNil && (value === null || value === undefined))
            return false;
    }
    if (value === null || value === undefined)
        return true;
    const dateValue = value instanceof Date ? value : new Date(value);
    if (filter.eq !== undefined) {
        const targetDate = new Date(filter.eq);
        if (dateValue.getTime() !== targetDate.getTime())
            return false;
    }
    if (filter.notEq !== undefined) {
        const targetDate = new Date(filter.notEq);
        if (dateValue.getTime() === targetDate.getTime())
            return false;
    }
    if (filter.greaterThan !== undefined) {
        const targetDate = new Date(filter.greaterThan);
        if (dateValue.getTime() <= targetDate.getTime())
            return false;
    }
    if (filter.greaterThanOrEqual !== undefined) {
        const targetDate = new Date(filter.greaterThanOrEqual);
        if (dateValue.getTime() < targetDate.getTime())
            return false;
    }
    if (filter.lessThan !== undefined) {
        const targetDate = new Date(filter.lessThan);
        if (dateValue.getTime() >= targetDate.getTime())
            return false;
    }
    if (filter.lessThanOrEqual !== undefined) {
        const targetDate = new Date(filter.lessThanOrEqual);
        if (dateValue.getTime() > targetDate.getTime())
            return false;
    }
    return true;
}
//# sourceMappingURL=filter-utils.js.map