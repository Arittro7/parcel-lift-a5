"use strict";
// src/app/modules/parcel/parcel.model.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parcel = exports.trackingSchema = void 0;
const mongoose_1 = require("mongoose");
const parcel_interface_1 = require("./parcel.interface");
const uuid_1 = require("uuid");
const user_model_1 = require("../user/user.model");
const formatDate_1 = require("../../utils/formatDate");
// -------------------- Tracking Schema
exports.trackingSchema = new mongoose_1.Schema({
    status: {
        type: String,
        enum: Object.values(parcel_interface_1.Status),
        required: true,
    },
    at: {
        type: Date,
        default: Date.now,
    },
}, {
    _id: false,
});
// -------------------- Parcel Schema
const parcelSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    trackingId: {
        type: String,
        unique: true,
        index: true,
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
    trackingEvents: {
        type: [exports.trackingSchema],
        default: [],
    },
    weight: {
        type: Number,
        required: true,
        min: 0,
    },
    estimatedDeliveryDate: {
        type: Date,
        required: true,
    },
    pickUpDate: Date,
    deliveryDate: Date,
    cancelledAt: Date,
    isBlocked: {
        type: Boolean,
        default: false,
    },
    cost: {
        type: Number,
        required: true,
        min: 0,
    },
}, {
    timestamps: true,
    versionKey: false,
});
// -------------------- Pre-save Hook --------------------
parcelSchema.pre("save", function (next) {
    if (!this.trackingId) {
        const date = (0, formatDate_1.FormatDate)(new Date());
        const uniqueId = (0, uuid_1.v4)();
        const trackingId = `TRK-${date}-${uniqueId.replace(/-/g, "").substring(0, 12)}`;
        this.trackingId = trackingId;
    }
    next();
});
exports.Parcel = (0, mongoose_1.model)("Parcel", parcelSchema);
