import { Router } from "express";
import { UserControllers } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";

const router = Router();

router.get("/getme", checkAuth(...Object.values(Role)), UserControllers.getme);

router.get(
  "/:id",
  checkAuth(...Object.values(Role)),
  UserControllers.getSingleUser
);

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserControllers.createUser
);
router.get("/all-users", checkAuth(Role.ADMIN), UserControllers.getAllUsers);
router.get(
  "/getUserByEmail/:email",
  checkAuth(...Object.values(Role)),
  UserControllers.getUserByEmail
);
router.patch(
  "/toggle/:id",
  checkAuth(Role.ADMIN),
  UserControllers.toggleUserStatus
);

router.patch(
  "/:id",
  validateRequest(updateUserZodSchema),
  checkAuth(...Object.values(Role)),
  UserControllers.updateUser
);
export const userRoutes = router;
