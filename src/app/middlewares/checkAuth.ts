import  httpStatus  from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { IsActive } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rawToken = req.cookies.accessToken || req.headers.authorization;

      if (!rawToken) {
        console.log("❌ No token received");
        throw new AppError(403, "No Token Received");
      }

      const accessToken = rawToken.startsWith("Bearer ")
        ? rawToken.split(" ")[1]
        : rawToken;

      console.log("🔑 Access Token:", accessToken);

      const verifiedToken = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload;

      console.log("✅ Decoded Token:", verifiedToken);

      const isUserExist = await User.findOne({ email: verifiedToken.email });
      console.log("👤 User from DB:", isUserExist);

      if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
      }
      if (
        isUserExist.isActive === IsActive.BLOCKED ||
        isUserExist.isActive === IsActive.INACTIVE
      ) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `User is ${isUserExist.isActive}`
        );
      }
      if (isUserExist.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
      }

      if (!authRoles.includes(verifiedToken.role)) {
        console.log("❌ Role not permitted:", verifiedToken.role);
        throw new AppError(403, "You are not permitted to view this route!!!");
      }

      req.user = verifiedToken;
      next();
    } catch (error) {
      console.error("❌ Auth error:", error);
      next(error);
    }
  };


// import  httpStatus  from 'http-status-codes';
// import { NextFunction, Request, Response } from "express";
// import { JwtPayload } from "jsonwebtoken";
// import { envVars } from "../config/env";
// import AppError from "../errorHelpers/AppError";
// import { verifyToken } from "../utils/jwt";
// import { IsActive } from '../modules/user/user.interface';
// import { User } from '../modules/user/user.model';

// export const checkAuth =
//   (...authRoles: string[]) =>
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const accessToken = req.cookies.accessToken || req.headers.authorization;

//       if (!accessToken) {
//         throw new AppError(403, "No Token Received");
//       }

//       const verifiedToken = verifyToken(
//         accessToken,
//         envVars.JWT_ACCESS_SECRET
//       ) as JwtPayload;

//               const isUserExist = await User.findOne({ email: verifiedToken.email })

//         if (!isUserExist) {
//             throw new AppError(httpStatus.BAD_REQUEST, "User does not exist")
//         }
//         // if (!isUserExist.isVerified) {
//         //     throw new AppError(httpStatus.BAD_REQUEST, "User is not verified")
//         // }
//         if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
//             throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
//         }
//         if (isUserExist.isDeleted) {
//             throw new AppError(httpStatus.BAD_REQUEST, "User is deleted")
//         }

//       if (!authRoles.includes(verifiedToken.role)) {
//         throw new AppError(403, "You are not permitted to view this route!!!");
//       }
//       req.user = verifiedToken;
//       next();
//     } catch (error) {
//       next(error);
//     }
//   };
