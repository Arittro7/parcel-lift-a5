import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { QueryBuilder } from "../../utils/QueryBuilder";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist");
  }

  const hashedPassword = await bcryptjs.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
  });
  return user;
};

const userSearchableFields = ["name", "email"];

const getAllUsers = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(User.find(), query);
  const usersData = queryBuilder
    .filter()
    .search(userSearchableFields)
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    usersData.build(),
    queryBuilder.getMeta(),
  ]);
  return {
    data,
    meta,
  };
};

const getSingleUser = async (id: string) => {
  const user = await User.findById(id).select("-password");
  return {
    data: user,
  };
};

// const getMe = async (userId: string) => {
//   const user = await User.findById(userId).select("-password");
//   return {
//     data: user,
//   };
// };

const getMeById = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  return {
    data: user,
  };
};


const getUserByEmail = async (email: string) => {
  const user = await User.findOne({ email }).select("-password");
  return {
    data: user,
  };
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decoded: JwtPayload
) => {
  if (decoded.role === Role.SENDER || decoded.role === Role.RECEIVER) {
    if (userId !== decoded.userId) {
      throw new AppError(401, "You are not authorized");
    }
  }

  const isUserExists = await User.findById(userId);
  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  if (payload.role) {
    if (decoded.role === Role.ADMIN) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }

  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
  }

  if (payload.password) {
    payload.password = await bcryptjs.hash(
      payload.password,
      envVars.BCRYPT_SALT_ROUND
    );
  }
  const updatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return updatedUser;
};

const toggleUserStatus = async (
  userId: string,
  isActive: "ACTIVE" | "INACTIVE" | "BLOCKED"
) => {
  if (!["ACTIVE", "INACTIVE", "BLOCKED"].includes(isActive)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid status");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { isActive }, // enum field
    { new: true }
  ).select("-password");

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return user;
};


export const UserServices = {
  createUser,
  getAllUsers,
  getSingleUser,
  // getMe,
  getMeById,
  getUserByEmail,
  updateUser,
  toggleUserStatus,
};
