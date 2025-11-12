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
exports.Parcel = exports.trackingSchema = void 0;
const mongoose_1 = require("mongoose");
const parcel_interface_1 = require("./parcel.interface");
const uuid_1 = require("uuid");
const user_model_1 = require("../user/user.model");
const formatDate_1 = require("../../utils/formatDate");
exports.trackingSchema = new mongoose_1.Schema({
    status: {
        type: String,
        enum: Object.values(parcel_interface_1.Status),
        required: true,
    },
    at: Date,
}, {
    _id: false,
});
const parcelSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    trackingId: {
        type: String,
    },
    senderInfo: user_model_1.addressSchema,
    deliveryLocation: user_model_1.addressSchema,
    sameDivision: {
        type: Boolean,
        required: true,
    },
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiver: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(parcel_interface_1.Status),
        default: parcel_interface_1.Status.REQUESTED,
        uppercase: true,
    },
    trackingEvents: [exports.trackingSchema],
    weight: {
        type: Number,
        required: true,
    },
    estimatedDeliveryDate: {
        type: Date,
        required: true,
    },
    pickUpDate: {
        type: Date,
    },
    deliveryDate: {
        type: Date,
    },
    cancelledAt: {
        type: Date,
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    cost: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});
parcelSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const date = (0, formatDate_1.FormatDate)(new Date());
        const uniqueId = (0, uuid_1.v4)();
        const trackingId = `TRK-${date}-${uniqueId
            .replace(/-g/, "")
            .substring(0, 12)}`;
        this.trackingId = trackingId;
        next();
    });
});
exports.Parcel = (0, mongoose_1.model)("Parcel", parcelSchema);
