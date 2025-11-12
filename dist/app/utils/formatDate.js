"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatDate = void 0;
const FormatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}${month}${day}`;
};
exports.FormatDate = FormatDate;
