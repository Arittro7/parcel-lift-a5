import { model, Schema } from "mongoose";
import { IParcel, ITracking, Status } from "./parcel.interface";
import { v4 as uuid4 } from "uuid";
import { addressSchema } from "../user/user.model";
import { FormatDate } from "../../utils/formatDate";

export const trackingSchema = new Schema<ITracking>(
  {
    status: {
      type: String,
      enum: Object.values(Status),
      required: true,
    },
    at: Date,
  },
  {
    _id: false,
  }
);
const parcelSchema = new Schema<IParcel>(
  {
    name: {
      type: String,
      required: true,
    },
    trackingId: {
      type: String,
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
    trackingEvents: [trackingSchema],
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

parcelSchema.pre("save", async function (next) {
  const date = FormatDate(new Date());
  const uniqueId = uuid4();
  const trackingId = `TRK-${date}-${uniqueId
    .replace(/-g/, "")
    .substring(0, 12)}`;
  this.trackingId = trackingId;
  next();
});
export const Parcel = model<IParcel>("Parcel", parcelSchema);