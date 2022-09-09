import { Response } from "express";

export const successResponse = (res: Response, data?: any) => {
  res.status(200).json({ message: "success", data });
};

export const badRequestResponse = (res: Response, message: string) => {
  res.status(400).json({ message });
};

export const internalServerErrorResponse = (res: Response, error: Error) => {
  res.status(500).json({ message: "something went wrong", error });
};

export const unauthorizedResponse = (res: Response, message: string) => {
  res.status(401).json({ message });
};
