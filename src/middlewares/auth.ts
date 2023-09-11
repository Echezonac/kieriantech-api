import { NextFunction, Request, Response } from "express";
import { isError } from "joi";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthenticationError } from "../customErrors";
import { CustomRequest } from "../utils/interfaces";

const JWT_SECRET = process.env.JWT_SECRET;

export const auth = (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    throw new AuthenticationError("Access denied. No token provided");
  }

  try {
    const decoded = jwt.verify(
      token,
      JWT_SECRET as string
    ) as JwtPayload["user"];
    req.user = decoded;
    next();
  } catch (err: any) {
    console.error(err.message);
    switch (err.name) {
      case "TokenExpiredError":
        return next(new AuthenticationError("Invalid or expired token"));
      case "JsonWebTokenError":
            console.error("JWT Error:", err.message);
        return next(new AuthenticationError("Invalid or expired token"));
      case "NotBeforeError":
        return next(new AuthenticationError("Invalid or expired token"));
      default:
        return next(err);
    }
  }
};
