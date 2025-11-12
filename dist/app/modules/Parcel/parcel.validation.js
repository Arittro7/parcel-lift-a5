"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createParcelZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const parcel_interface_1 = require("./parcel.interface");
const trackingZodSchema = zod_1.default.object({
    location: zod_1.default.string(),
    status: zod_1.default.nativeEnum(parcel_interface_1.Status),
    timestamp: zod_1.default.preprocess((val) => new Date(val), zod_1.default.date()),
});
const addressZodSchema = zod_1.default.object({
    division: zod_1.default.string(),
    city: zod_1.default.string(),
    street: zod_1.default.string(),
    zip: zod_1.default.string(),
});
exports.createParcelZodSchema = zod_1.default.object({
    name: zod_1.default.string({
        error: "Parcel name is required",
    }),
    trackingId: zod_1.default.string().optional(),
    senderInfo: addressZodSchema,
    deliveryLocation: addressZodSchema,
    sameDivision: zod_1.default.boolean({
        error: "sameDivision is required",
    }),
    sender: zod_1.default.string({
        error: "Sender ID is required",
    }),
    receiver: zod_1.default.string({
        error: "Receiver ID is required",
    }),
    status: zod_1.default.nativeEnum(parcel_interface_1.Status).optional(), // default handled in backend
    trackingEvents: zod_1.default.array(trackingZodSchema).optional(),
    weight: zod_1.default.number({
        error: "Weight is required",
    }),
    estimatedDeliveryDate: zod_1.default.preprocess((val) => new Date(val), zod_1.default.date({
        error: "Estimated delivery date is required",
    })),
    pickUpDate: zod_1.default.preprocess((val) => (val ? new Date(val) : undefined), zod_1.default.date().optional()),
    deliveryDate: zod_1.default.preprocess((val) => (val ? new Date(val) : undefined), zod_1.default.date().optional()),
    isBlocked: zod_1.default.boolean().optional(),
    cost: zod_1.default.number({
        error: "Cost is required",
    }),
});
