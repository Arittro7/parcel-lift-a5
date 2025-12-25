/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryBuilder } from "../../utils/QueryBuilder";
import { IParcel } from "./parcel.interface";
import { Parcel } from "./parcel.model";

const getAllParcels = async (query: Record<string, string>) => {
  const parcelSearchableFields = ["name", "trackingId"];

  const queryBuilder = new QueryBuilder(Parcel.find(), query);

  const parcelsData = queryBuilder
    .filter()
    .search(parcelSearchableFields)
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    parcelsData.build(),
    queryBuilder.getmeta(),
  ]);

  return { data, meta };
};

const getParcelsById = async (id: string) => {
  const parcel = await Parcel.findById(id);
  return parcel;
};

const getParcelsByTrackingId = async (id: string) => {
  const parcel = await Parcel.find({ trackingId: id });
  return parcel;
};

// sender
const createParcel = async (payload: Partial<IParcel>) => {
  const parcel = await Parcel.create(payload);
  return parcel;
};

const getTheirParcels = async (parcelId: string) => {
  const parcel = await Parcel.find({ sender: parcelId });
  return parcel;
};

const cancelParcel = async (parcelId: string, senderId: string) => {
  const parcel = await Parcel.findOne({
    _id: parcelId,
    sender: senderId,
    status: { $in: ["REQUESTED", "APPROVED"] },
  });

  if (!parcel) {
    throw new Error("Parcel not found or already dispatched.");
  }

  parcel.status = "CANCELLED";
  parcel.cancelledAt = new Date();
  await parcel.save();

  return parcel;
};

// receiver
const getIncomingParcels = async (receiverId: string) => {
  const parcels = await Parcel.find({
    receiver: receiverId,
    status: { $in: ["DISPATCHED", "IN_TRANSIT"] },
  });
  return parcels;
};

const confirmParcelDelivery = async (parcelId: string, receiverId: string) => {
  const parcel = await Parcel.findOne({
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

  await parcel.save();

  return parcel;
};

const getDeliveryHistory = async (receiverId: string) => {
  const parcels = await Parcel.find({
    receiver: receiverId,
    status: "DELIVERED",
  });
  return parcels;
};

// admin
const blockParcel = async (parcelId: string) => {
  const parcel = await Parcel.findByIdAndUpdate(
    parcelId,
    { isBlocked: true },
    { new: true }
  );
  return parcel;
};

const unblockParcel = async (parcelId: string) => {
  const parcel = await Parcel.findByIdAndUpdate(
    parcelId,
    { isBlocked: false },
    { new: true }
  );
  return parcel;
};

const updateParcelStatus = async (parcelId: string, status: string) => {
  const parcel = await Parcel.findByIdAndUpdate(
    parcelId,
    { status },
    { new: true }
  );
  return parcel;
};


// Parcel Stats
const getParcelStats = async () => {
  // Status Counts
  let statusCounts = await Parcel.aggregate([
    {
      $group: {
        _id: "$status",
        name: { $first: "$status" },
        value: { $sum: 1 },
      },
    },
  ]);

  if (statusCounts.length === 0) {
    statusCounts = [
      { name: "No Parcels Yet", value: 0 },
    ];
  } else {
    statusCounts = statusCounts.map((item: any) => {
      let displayName = "Pending";
      if (item.name && typeof item.name === "string") {
        displayName = item.name
          .split("_")
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(" ");
      }
      return { name: displayName, value: item.value || 0 };
    });
  }

  // Monthly parcels - also handle empty
  let monthlyParcels = await Parcel.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        parcels: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
    {
      $project: {
        _id: 0,
        month: { $substr: ["$_id", 5, 2] },
        parcels: 1,
      },
    },
  ]);

  if (monthlyParcels.length === 0) {
    // Optional: show last 12 months with 0 parcels
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonth = new Date().getMonth(); // 0-11
    monthlyParcels = [];
    for (let i = 11; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      monthlyParcels.push({ month: months[monthIndex], parcels: 0 });
    }
  }

  return {
    statusCounts,
    monthlyParcels,
  };
};

export const ParcelServices = {
  getParcelsByTrackingId,
  createParcel,
  getParcelsById,
  getTheirParcels,
  cancelParcel,
  getIncomingParcels,
  confirmParcelDelivery,
  getDeliveryHistory,
  getAllParcels,
  blockParcel,
  unblockParcel,
  updateParcelStatus,
  getParcelStats
};
