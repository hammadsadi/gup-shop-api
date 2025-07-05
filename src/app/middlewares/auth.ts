import { NextFunction, Request, Response } from "express";
import { JwtPayload, Secret } from "jsonwebtoken";
import httpStatus from "http-status";
import ApiError from "../errors/ApiError";
import { jwtHelpers } from "../utils/jwtHelpers";
import config from "../config";
import prisma from "../utils/prisma";

const auth = () => {
  return async (
    req: Request & { user?: JwtPayload },
    res: Response,
    next: NextFunction
  ) => {
    try {
      let token;

      // 🔍 1. Check Authorization header first
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
      ) {
        token = req.headers.authorization.split(" ")[1];
      }

      // 🔍 2. If no header, check cookie
      if (!token && req.cookies) {
        token = req.cookies["gup-shup-tkn"];
      }
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!");
      }

      const verifiedUser = jwtHelpers.verifyToken(
        token,
        config.JWT.JWT_ACCESS_SECRET as Secret
      );

      // Check User
      const user = await prisma.user.findUnique({
        where: {
          id: verifiedUser.id,
        },
      });

      // Check User
      if (!user) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!");
      }
      // Check User Account Active or Not
      if (user?.isAccountActive === false) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Your Account Not Active");
      }

      req.user = verifiedUser;

      next();
    } catch (err) {
      next(err);
    }
  };
};

export default auth;
