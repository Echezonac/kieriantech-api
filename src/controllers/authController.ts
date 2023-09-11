import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ConflictError, NotFoundError, ValidationError } from "../customErrors";
import { successResponse } from "../helpers";
import logger from "../logger";
import User from "../models/User";
import { CustomRequest } from "../utils/interfaces";

const JWT_SECRET = process.env.JWT_SECRET;

export const login = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      throw new ValidationError("Invalid credentials!");
    }

    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) {
      throw new ValidationError("Invalid credentials!");
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET as string, {
      expiresIn: "1hr",
    });

    successResponse(res, 200, {
      message: "User logged in successfully",
      token,
    });
  } catch (err: any) {
    console.error(err);
    next(err);
  }
};

// // Get a single user
export const getSingleUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-createdAt -updatedAt -__v -password -otp"
    );

    if (!user) {
      throw new NotFoundError("User not found");
    }

    successResponse(res, 200, {
      message: "User retrieved successfully",
      user,
    });
  } catch (err: any) {
    console.log(err);
    next(err);
  }
};

export const getLoggedInUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    console.log("userId", req.user);

    const user = await User.findById(userId as string).select("-password -__v");

    if (!user) {
      console.log(user);
      throw new NotFoundError("User not found");
    }

    successResponse(res, 200, {
      message: "Logged in user retrieved",
      user,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
