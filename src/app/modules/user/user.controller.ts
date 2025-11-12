/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { UserServices } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User Created Successfully",
      data: user,
    });
  }
);

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await UserServices.getAllUsers(
      query as Record<string, string>
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All Users Retrieved Successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

const getSingleUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await UserServices.getSingleUser(id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Retrieved Successfully",
      data: result.data,
    });
  }
);

const getme = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const result = await UserServices.getme(decodedToken.userId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Your profile Retrieved Successfully",
      data: result.data,
    });
  }
);

// const getme = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const decodedToken = req.user as JwtPayload;
//     const result = await UserServices.getmeById(decodedToken.userId);
//     sendResponse(res, {
//       success: true,
//       statusCode: httpStatus.OK,
//       message: "Your profile Retrieved Successfully",
//       data: result.data,
//     });
//   }
// );

const getUserByEmail = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const email = req.params.email;
    const result = await UserServices.getUserByEmail(email);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Your profile Retrieved Successfully",
      data: result.data,
    });
  }
);

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const payload = req.body;
    const decodedToken = req.user;
    const result = await UserServices.updateUser(
      id,
      payload,
      decodedToken as JwtPayload
    );
    sendResponse(res, {
      success: true,
      message: "User updated successfully!",
      statusCode: 201,
      data: result,
    });
  }
);

const toggleUserStatus = async (req: Request, res: Response) => {
  const result = await UserServices.toggleUserStatus(
    req.params.id,
    req.body.isActive
  );

  // Dynamic message based on isActive
  let message = "";
  switch (req.body.isActive) {
    case "ACTIVE":
      message = "User activated successfully!";
      break;
    case "INACTIVE":
      message = "User set to inactive!";
      break;
    case "BLOCKED":
      message = "User blocked successfully!";
      break;
    default:
      message = "User status updated!";
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message,
    data: result,
  });
};

export const UserControllers = {
  createUser,
  getAllUsers,
  getSingleUser,
  getme,
  getUserByEmail,
  updateUser,
  toggleUserStatus,
};
