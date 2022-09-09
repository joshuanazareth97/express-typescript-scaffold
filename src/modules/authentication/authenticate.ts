import { Request, Response, NextFunction } from "express";
import { NetworkAuthenticationRequire } from "http-errors";
import { JwtPayload } from "jsonwebtoken";
import { validateJwt } from ".";
import config from "../../config/config";
import {
  internalServerErrorResponse,
  unauthorizedResponse,
} from "../common/responses";
import { User } from "../users/user.entity";
import { getUserById } from "../users/user.manager";
const jwt = require("jsonwebtoken");

export const validateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (
      req.headers &&
      ![null, undefined].includes(req.headers.authorization as any)
    ) {
      const accessToken: string = (req.headers.authorization || "")
        .toString()
        .replace("Bearer", "")
        .trim();

      const payload = (await validateJwt(accessToken)) as JwtPayload;
      if (payload) {
        const user = await getUserById(payload.id);
        req.user = user;
        verifyUserRequest(res, user as User, next);
      } else {
        unauthorizedResponse(res, "invalid access token");
      }
    } else {
      unauthorizedResponse(res, "token not found");
    }
  } catch (error) {
    internalServerErrorResponse(res, error);
  }
};

const verifyUserRequest = (res: Response, user: User, next: NextFunction) => {
  if (!(user as User).isVerified) {
    unauthorizedResponse(res, "email is not verified");
  } else if (!user?.isActive) {
    unauthorizedResponse(res, "user is not active");
  } else {
    next();
  }
};
