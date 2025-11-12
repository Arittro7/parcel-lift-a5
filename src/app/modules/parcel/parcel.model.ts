// src/app/modules/parcel/parcel.model.ts

import { model, Schema } from "mongoose";
import { IParcel, ITracking, Status } from "./parcel.interface";
import { v4 as uuidv4 } from "uuid";
import { addressSchema } from "../user/user.model";
import { FormatDate } from "../../utils/formatDate";

// -------------------- Tracking Schema
export const trackingSchema = new Schema<ITracking>(
  {
    status: {
      type: String,
      enum: Object.values(Status),
      required: true,
    },
    at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  }
);

// -------------------- Parcel Schema
const parcelSchema = new Schema<IParcel>(
  {
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
    senderInfo: addressSchema,
    deliveryLocation: addressSchema,
    sameDivision: {
      type: Boolean,
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.REQUESTED,
      uppercase: true,
    },
    trackingEvents: {
      type: [trackingSchema],
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// -------------------- Pre-save Hook --------------------
parcelSchema.pre("save", function (next) {
  if (!this.trackingId) {
    const date = FormatDate(new Date());
    const uniqueId = uuidv4();
    const trackingId = `TRK-${date}-${uniqueId.replace(/-/g, "").substring(0, 12)}`;
    this.trackingId = trackingId;
  }
  next();
});

export const Parcel = model<IParcel>("Parcel", parcelSchema);