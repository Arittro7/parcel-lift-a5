import { Router } from "express";
import { ParcelControllers } from "./parcel.controler";
import { validateRequest } from "../../middlewares/validateRequest";
import { createParcelZodSchema } from "./parcel.validation";
import { Role } from "../user/user.interface";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router()

router.get("/tracking/:id", ParcelControllers.getParcelsByTrackingId)

// sender
router.post("/",checkAuth(Role.SENDER),validateRequest(createParcelZodSchema), ParcelControllers.createParcel)
router.get("/my",checkAuth(Role.SENDER), ParcelControllers.getTheirParcels)
router.patch("/cancel/:id",checkAuth(Role.SENDER), ParcelControllers.cancelParcel)


// receiver route
router.get("/incoming",checkAuth(Role.RECEIVER), ParcelControllers.getIncomingParcels)
router.patch("/confirmDelivery/:id",checkAuth(Role.RECEIVER), ParcelControllers.confirmParcelDelivery)
router.get("/delivered",checkAuth(Role.RECEIVER), ParcelControllers.getDeliveryHistory)


// admin
router.get("/all-parcels",checkAuth(Role.ADMIN), ParcelControllers.getAllParcels)
router.patch("/block/:id",checkAuth(Role.ADMIN), ParcelControllers.blockParcel)
router.patch("/unblock/:id",checkAuth(Role.ADMIN), ParcelControllers.unblockParcel)
router.patch("/update-status/:id",checkAuth(Role.ADMIN), ParcelControllers.updateParcelStatus)

export const parcelRoutes = router