import z from "zod";
import { Status } from "./parcel.interface";

const trackingZodSchema = z.object({
  location: z.string(),
  status: z.nativeEnum(Status),
  timestamp: z.preprocess((val) => new Date(val as string), z.date()),
});

const addressZodSchema = z.object({
  division: z.string(),
  city: z.string(),
  street: z.string(),
  zip: z.string(),
});

export const createParcelZodSchema = z.object({
  name: z.string({
    error: "Parcel name is required",
  }),
  trackingId: z.string().optional(),
  senderInfo: addressZodSchema,
  deliveryLocation: addressZodSchema,
  sameDivision: z.boolean({
    error: "sameDivision is required",
  }),
  sender: z.string({
    error: "Sender ID is required",
  }),
  receiver: z.string({
    error: "Receiver ID is required",
  }),
  status: z.nativeEnum(Status).optional(), // default handled in backend
  trackingEvents: z.array(trackingZodSchema).optional(),
  weight: z.number({
    error: "Weight is required",
  }),
  estimatedDeliveryDate: z.preprocess(
    (val) => new Date(val as string),
    z.date({
      error: "Estimated delivery date is required",
    })
  ),
  pickUpDate: z.preprocess(
    (val) => (val ? new Date(val as string) : undefined),
    z.date().optional()
  ),
  deliveryDate: z.preprocess(
    (val) => (val ? new Date(val as string) : undefined),
    z.date().optional()
  ),
  isBlocked: z.boolean().optional(),
  cost: z.number({
    error: "Cost is required",
  }),
});
