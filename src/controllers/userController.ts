import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ConflictError, ValidationError } from "../customErrors";
import { successResponse } from "../helpers";
import logger from "../logger";
import User from "../models/User";
import { CustomRequest } from "../utils/interfaces";

const JWT_SECRET = process.env.JWT_SECRET;

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find().select("-password -__v");
    logger.info("Users fetched successfully", {
      users,
      timestamp: new Date().toISOString(),
    });

    successResponse(res, 201, {
      message: "User created successfully",
      users,
    });
  } catch (err: any) {
    console.error(err);
    next(err);
  }
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;

    // check if user already exists
    let user = await User.findOne({ username });

    if (user) {
      throw new ConflictError("User already exists");
    }

    user = new User({
      username,
      password,
    });

    
    await user.save();
    
    user = await User.findById(user._id).select("-password -__v");

    logger.info(`User ${username} created successfully`, {
      userId: user._id,
      timestamp: new Date().toISOString(),
    });

    successResponse(res, 201, {
      message: "User created successfully",
      user,
    });
  } catch (err: any) {
    console.error(err);
    next(err);
  }
};
