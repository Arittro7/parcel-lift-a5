"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Status = void 0;
var Status;
(function (Status) {
    Status["REQUESTED"] = "REQUESTED";
    Status["APPROVED"] = "APPROVED";
    Status["DISPATCHED"] = "DISPATCHED";
    Status["IN_TRANSIT"] = "IN_TRANSIT";
    Status["DELIVERED"] = "DELIVERED";
    Status["CANCELLED"] = "CANCELLED";
    Status["FAILED_DELIVERY"] = "FAILED_DELIVERY";
    Status["RESCHEDULED"] = "RESCHEDULED";
})(Status || (exports.Status = Status = {}));
