import { Query, Document } from "mongoose";
import { excludeField } from "../constants";

export class QueryBuilder<T extends Document> {
  public modelQuery: Query<T[], T>;
  public readonly query: Record<string, string>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  /** 🔍 Filter Query (ignores excluded fields) */
  filter(): this {
    const filter = { ...this.query };

    for (const field of excludeField) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete filter[field];
    }

    // Apply filters
    this.modelQuery = this.modelQuery.find(filter);
    return this;
  }

  /** 🔎 Text Search across given fields */
  search(searchableFields: string[]): this {
    const searchTerm = this.query.searchTerm?.trim();

    if (searchTerm) {
      const searchQuery = {
        $or: searchableFields.map((field) => ({
          [field]: { $regex: new RegExp(searchTerm, "i") },
        })),
      };

      // Merge with existing filter query
      this.modelQuery = this.modelQuery.find({
        ...this.modelQuery.getQuery(),
        ...searchQuery,
      });
    }

    return this;
  }

  /** 🧭 Sort (default: newest first) */
  sort(): this {
    const sort = this.query.sort || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sort);
    return this;
  }

  /** 📋 Select specific fields */
  fields(): this {
    const fields = this.query.fields?.split(",").join(" ") || "-__v";
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  /** 📄 Pagination handler */
  paginate(): this {
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
  async getMeta() {
    const filterConditions = this.modelQuery.getQuery(); // Get applied filters/search
    const totalDocuments = await this.modelQuery.model.countDocuments(filterConditions);

    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const totalPage = Math.ceil(totalDocuments / limit);

    return { page, limit, total: totalDocuments, totalPage };
  }
}
