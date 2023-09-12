import { NextFunction } from "connect";
import { Request, Response } from "express";
import { NotFoundError, ValidationError } from "../customErrors";
import { successResponse } from "../helpers";
import logger from "../logger";
import Agent from "../models/Agent";
import Transaction from "../models/Transaction";
import { transferFunds } from "../services/transactionService";
import { CustomRequest } from "../utils/interfaces";

export const createTransaction = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;

  try {
    const { amount, toAgentId, pin } = req.body;

    const agent = await Agent.findById(userId);
    if (!agent) {
      throw new NotFoundError("Agent not found");
    }

    const toAgent = await Agent.findById(toAgentId);
    if (!toAgent) {
      throw new NotFoundError("Recipient agent not found");
    }

    // Verify the PIN
    const isPinValid = await agent.comparePin(pin);
    if (!isPinValid) {
      throw new ValidationError("Invalid PIN");
    }

    // Transfer funds between agent and wallet
    await transferFunds(userId as string, toAgent._id as string, amount);

    let transaction = new Transaction({
      fromAgent: userId,
      toAgent: toAgent._id,
      amount,
    });

    await transaction.save();

    logger.info(`Transaction created successfully`, {
      transactionId: transaction._id,
      timestamp: new Date().toISOString(),
    });

    let transactionData = await Transaction.findById(transaction._id)
      .select("-_id")
      .populate("toAgent", "_id username")
      .populate("fromAgent", "_id username");

    successResponse(res, 201, {
      message: "Transaction created successfully",
      transactionData,
    });
  } catch (err: any) {
    console.error(err);
    next(err);
  }
};
