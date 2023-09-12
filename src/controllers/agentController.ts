import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { ConflictError, ValidationError } from "../customErrors";
import { successResponse } from "../helpers";
import logger from "../logger";
import Agent from "../models/Agent";
import Wallet from "../models/Wallet";
import { CustomRequest } from "../utils/interfaces";

const JWT_SECRET = process.env.JWT_SECRET;

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const agents = await Agent.find().select("-pin -__v");
    logger.info("Agents fetched successfully", {
      agents,
      timestamp: new Date().toISOString(),
    });

    successResponse(res, 201, {
      message: "Agents fetched successfully",
      agents,
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
  // const session = await mongoose.startSession();
  // session.startTransaction();

  try {
    const { username, pin } = req.body;

    // check if user already exists
    let agent = await Agent.findOne({ username });

    if (agent) {
      throw new ConflictError("User already exists");
    }

    agent = new Agent({
      username,
      pin,
    });

    // await agent.save({ session });
    await agent.save();

    // Create a new wallet for the agent
    const wallet = new Wallet({
      agent: agent._id,
    });

    // await wallet.save({ session });
    await wallet.save();

    agent = await Agent.findById(agent._id).select("-pin -__v");

    logger.info(`User ${username} created successfully`, {
      userId: agent._id,
      timestamp: new Date().toISOString(),
    });

    // await session.commitTransaction();
    // session.endSession();

    successResponse(res, 201, {
      message: "Agents fetched successfully",
      agent,
    });
  } catch (err: any) {
    console.error(err);
    // await session.abortTransaction();
    // session.endSession();
    next(err);
  }
};
