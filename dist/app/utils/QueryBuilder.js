"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilder = void 0;
const constants_1 = require("../constants");
class QueryBuilder {
    constructor(modelQuery, query) {
        this.modelQuery = modelQuery;
        this.query = query;
    }
    /** 🔍 Filter Query (ignores excluded fields) */
    filter() {
        const filter = Object.assign({}, this.query);
        for (const field of constants_1.excludeField) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete filter[field];
        }
        // Apply filters
        this.modelQuery = this.modelQuery.find(filter);
        return this;
    }
    /** 🔎 Text Search across given fields */
    search(searchableFields) {
        var _a;
        const searchTerm = (_a = this.query.searchTerm) === null || _a === void 0 ? void 0 : _a.trim();
        if (searchTerm) {
            const searchQuery = {
                $or: searchableFields.map((field) => ({
                    [field]: { $regex: new RegExp(searchTerm, "i") },
                })),
            };
            // Merge with existing filter query
            this.modelQuery = this.modelQuery.find(Object.assign(Object.assign({}, this.modelQuery.getQuery()), searchQuery));
        }
        return this;
    }
    /** 🧭 Sort (default: newest first) */
    sort() {
        const sort = this.query.sort || "-createdAt";
        this.modelQuery = this.modelQuery.sort(sort);
        return this;
    }
    /** 📋 Select specific fields */
    fields() {
        var _a;
        const fields = ((_a = this.query.fields) === null || _a === void 0 ? void 0 : _a.split(",").join(" ")) || "-__v";
        this.modelQuery = this.modelQuery.select(fields);
        return this;
    }
    /** 📄 Pagination handler */
    paginate() {
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;
        const skip = (page - 1) * limit;
        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }
    /** 🏗️ Return the final built query */
    build() {
        return this.modelQuery;
    }
    /** 📊 Get pagination + total info */
    getmeta() {
        return __awaiter(this, void 0, void 0, function* () {
            const filterConditions = this.modelQuery.getQuery(); // Get applied filters/search
            const totalDocuments = yield this.modelQuery.model.countDocuments(filterConditions);
            const page = Number(this.query.page) || 1;
            const limit = Number(this.query.limit) || 10;
            const totalPage = Math.ceil(totalDocuments / limit);
            return { page, limit, total: totalDocuments, totalPage };
        });
    }
}
exports.QueryBuilder = QueryBuilder;
