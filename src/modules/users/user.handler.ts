import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import {
  verifyPassword,
  generateAccessToken,
  validateJwt,
} from "../authentication";
import {
  badRequestResponse,
  internalServerErrorResponse,
  successResponse,
  unauthorizedResponse,
} from "../common/responses";
import { sendForgetPasswordMail, sendVerifyMail } from "../mailer/send-mail";
import { User } from "./user.entity";
import {
  createUser,
  getUserByEmail,
  getAllUsers,
  getUserById,
  updateUser,
} from "./user.manager";
export const getAll = async (req: Request, res: Response) => {
  const users = await getAllUsers();
  successResponse(res, users);
};

export const register = async (req: Request, res: Response) => {
  try {
    if (!(await getUserByEmail(req.body.email))) {
      const user: User = await createUser(req.body);
      const newUser: any = { ...user };
      delete newUser.password;
      const accessToken = await generateAccessToken(user);
      await sendVerifyMail(newUser.email, accessToken);
      successResponse(res, newUser);
    } else {
      badRequestResponse(res, "email already exists");
    }
  } catch (error) {
    internalServerErrorResponse(res, error);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const user = await getUserByEmail(req.body.email);
    const { password } = req.body;
    if (user) {
      if (verifyPassword(password, user.password)) {
        if (!user.isActive) {
          unauthorizedResponse(res, "user is not active");
        } else if (!user.isVerified) {
          unauthorizedResponse(res, "email is not verified");
        } else {
          const accessToken = await generateAccessToken(user);
          successResponse(res, { accessToken });
        }
      } else {
        unauthorizedResponse(res, "invalid username or password");
      }
    } else {
      unauthorizedResponse(res, "user does not exist");
    }
  } catch (error) {
    internalServerErrorResponse(res, error);
  }
};

export const verifyUser = async (req: Request, res: Response) => {
  try {
    const token = req.query.token;
    const payload = (await validateJwt(token as string)) as JwtPayload;
    if (payload) {
      await updateUser({ isVerified: true }, payload.id);
      successResponse(res);
    } else {
      unauthorizedResponse(res, "token expired");
    }
  } catch (error) {
    internalServerErrorResponse(res, error);
  }
};

export const forgetPassword = async (req: Request, res: Response) => {
  try {
    const email = req.query.email as string;
    const user = await getUserByEmail(email);
    const accessToken = await generateAccessToken(user as User);
    sendForgetPasswordMail(email, accessToken);
    successResponse(res);
  } catch (error) {
    internalServerErrorResponse(res, error);
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const id = (req.user as User).id;
    await updateUser(
      new User({ ...(req.user as User), password: req.body.password }),
      id
    );
    successResponse(res);
  } catch (error) {
    internalServerErrorResponse(res, error);
  }
};
