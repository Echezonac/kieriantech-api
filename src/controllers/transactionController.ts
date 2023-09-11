import { NextFunction } from "connect";
import { Request, Response } from "express";
import { successResponse } from "../helpers";
import logger from "../logger";
import Transaction from "../models/Transaction";
import { CustomRequest } from "../utils/interfaces";
import { transferFunds } from "../services/transactionService";

export const createTransaction = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;
  try {
    const userId = req.user?.id;

    const { amount, toWalletId } = req.body;

    // Transfer funds between agent and wallet
    await transferFunds(userId as string, toWalletId, amount);

    let transaction = new Transaction({
      fromAgentId: userId,
      toWalletId: req.body.toWalletId,
      amount,
    });

    await transaction.save();

    logger.info(`Transaction created successfully`, {
      transactionId: transaction._id,
      timestamp: new Date().toISOString(),
    });

    successResponse(res, 201, {
      message: "Transaction created successfully",
      transaction,
    });
  } catch (err: any) {
    console.error(err);
    next(err);
  }
};
