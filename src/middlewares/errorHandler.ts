import { NextFunction, Request, Response } from "express";
import { AppError } from "../customErrors";
import logger from "../logger";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  // Handle other types of errors here, like Mongoose validation errors, etc.
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e: any) => {
      e.message;
    });
    return res.status(422).json({
      message: messages.join(", "),
    });
  }

  // If it's not an operational error, log it (you can integrate a logging system here)
  if (!err.isOperational) {
    logger.error('An unexpected error occured:', err);
  }

  // Send generic message for unexpected errors
  res.status(500).json({
    message: "An unexpected error occured",
  });
};
