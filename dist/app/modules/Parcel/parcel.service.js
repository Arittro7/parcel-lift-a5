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
exports.ParcelServices = void 0;
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const parcel_model_1 = require("./parcel.model");
const getParcelsByTrackingId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.find({ trackingId: id });
    return parcel;
});
// sender
const createParcel = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.create(payload);
    return parcel;
});
const getTheirParcels = (parcelId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.find({ sender: parcelId });
    return parcel;
});
const cancelParcel = (parcelId, senderId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findOne({
        _id: parcelId,
        sender: senderId,
        status: { $in: ["REQUESTED", "APPROVED"] },
    });
    if (!parcel) {
        throw new Error("Parcel not found or already dispatched.");
    }
    parcel.status = "CANCELLED";
    parcel.cancelledAt = new Date();
    yield parcel.save();
    return parcel;
});
// receiver
const getIncomingParcels = (receiverId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcels = yield parcel_model_1.Parcel.find({
        receiver: receiverId,
        status: { $in: ["DISPATCHED", "IN_TRANSIT"] },
    });
    return parcels;
});
const confirmParcelDelivery = (parcelId, receiverId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findOne({
        _id: parcelId,
        receiver: receiverId,
        status: "IN_TRANSIT",
    });
    if (!parcel) {
        throw new Error("Parcel is not eligible for delivery confirmation.");
    }
    // Now update the status to DELIVERED
    parcel.status = "DELIVERED";
    parcel.deliveryDate = new Date();
    yield parcel.save();
    return parcel;
});
const getDeliveryHistory = (receiverId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcels = yield parcel_model_1.Parcel.find({
        receiver: receiverId,
        status: "DELIVERED",
    });
    return parcels;
});
// admin
const getAllParcels = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const parcelSearchableFields = ["name", "trackingId"];
    const queryBuilder = new QueryBuilder_1.QueryBuilder(parcel_model_1.Parcel.find(), query);
    const parcelsData = queryBuilder
        .filter()
        .search(parcelSearchableFields)
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        parcelsData.build(),
        queryBuilder.getmeta(),
    ]);
    return { data, meta };
});
const blockParcel = (parcelId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findByIdAndUpdate(parcelId, { isBlocked: true }, { new: true });
    return parcel;
});
const unblockParcel = (parcelId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findByIdAndUpdate(parcelId, { isBlocked: false }, { new: true });
    return parcel;
});
const updateParcelStatus = (parcelId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findByIdAndUpdate(parcelId, { status }, { new: true });
    return parcel;
});
exports.ParcelServices = {
    getParcelsByTrackingId,
    createParcel,
    getTheirParcels,
    cancelParcel,
    getIncomingParcels,
    confirmParcelDelivery,
    getDeliveryHistory,
    getAllParcels,
    blockParcel,
    unblockParcel,
    updateParcelStatus,
};
