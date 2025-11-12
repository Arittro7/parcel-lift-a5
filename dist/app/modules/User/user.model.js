"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.addressSchema = void 0;
const mongoose_1 = require("mongoose");
const user_interface_1 = require("./user.interface");
const authProviderScheme = new mongoose_1.Schema({
    provider: {
        type: String,
        required: true,
    },
    providerId: {
        type: String,
        required: true,
    },
});
exports.addressSchema = new mongoose_1.Schema({
    division: {
        type: String,
        enum: Object.values(user_interface_1.Divisions),
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    zip: {
        type: Number,
        required: true,
    },
    street: {
        type: String,
        required: true,
    },
}, { _id: false });
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
    },
    phone: {
        type: String,
    },
    picture: {
        type: String,
    },
    address: { type: exports.addressSchema },
    role: {
        type: String,
        enum: Object.values(user_interface_1.Role),
        required: true,
    },
    isDeleted: {
        type: Boolean,
    },
    isActive: {
        type: String,
        enum: Object.values(user_interface_1.IsActive),
        default: user_interface_1.IsActive.ACTIVE,
    },
    isVerified: { type: Boolean, default: false },
    auths: [authProviderScheme],
    parcels: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: "Parcel",
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.User = (0, mongoose_1.model)("User", userSchema);
