import { QueryBuilder } from "../../utils/QueryBuilder";
import { IParcel } from "./parcel.interface";
import { Parcel } from "./parcel.model";

const getParcelsByTrackingId = async (id: string) => {
 const parcel = await Parcel.find({trackingId: id})
  return parcel;
};

// sender
const createParcel = async (payload: Partial<IParcel>) => {
  const parcel = await Parcel.create(payload);
  return parcel;
};

const getTheirParcels = async (parcelId: string) => {
 const parcel = await Parcel.find({sender: parcelId})
  return parcel;
};

const cancelParcel = async (parcelId: string, senderId: string) => {
  const parcel = await Parcel.findOne({
    _id: parcelId,
    sender: senderId,
    status: { $in: ['REQUESTED','APPROVED'] }
  });

  if (!parcel) {
    throw new Error('Parcel not found or already dispatched.');
  }

  parcel.status = 'CANCELLED';
  parcel.cancelledAt = new Date();
  await parcel.save();

  return parcel;
};


// receiver
const getIncomingParcels = async (receiverId: string) => {
  const parcels = await Parcel.find({
    receiver: receiverId,
    status: { $in: ['DISPATCHED', 'IN_TRANSIT'] }
  });
  return parcels;
};

const confirmParcelDelivery = async (parcelId: string, receiverId: string) => {
  const parcel = await Parcel.findOne({
    _id: parcelId,
    receiver: receiverId,
    status: 'IN_TRANSIT',
  });

  if (!parcel) {
    throw new Error('Parcel is not eligible for delivery confirmation.');
  }

  // Now update the status to DELIVERED
  parcel.status = 'DELIVERED';
  parcel.deliveryDate = new Date();

  await parcel.save();

  return parcel;
};


const getDeliveryHistory = async (receiverId: string) => {
  const parcels = await Parcel.find({
    receiver: receiverId,
    status: 'DELIVERED'
  });
  return parcels;
};

// admin

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
    queryBuilder.getMeta(),
  ]);

  return { data, meta };
};


const blockParcel = async (parcelId: string) => {
  const parcel = await Parcel.findByIdAndUpdate(parcelId, { isBlocked: true }, { new: true });
  return parcel;
};

const unblockParcel = async (parcelId: string) => {
  const parcel = await Parcel.findByIdAndUpdate(parcelId, { isBlocked: false }, { new: true });
  return parcel;
};

const updateParcelStatus = async (parcelId: string, status: string) => {
  const parcel = await Parcel.findByIdAndUpdate(parcelId, { status }, { new: true });
  return parcel;
};



export const ParcelServices = {
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
    updateParcelStatus

}