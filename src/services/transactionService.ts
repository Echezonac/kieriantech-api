import { NotFoundError, ServiceError } from "../customErrors";
import Agent from "../models/Agent";
import Wallet from "../models/Wallet";

export const transferFunds = async (
  fromAgentId: string,
  toAgentId: string,
  amount: number
) => {
  const fromAgentWallet = await Wallet.findOne({ agent: fromAgentId });
  if (!fromAgentWallet) {
    throw new NotFoundError("Recipient agent wallet not found");
  }

  const toAgentWallet = await Wallet.findOne({ agent: toAgentId });
  if (!toAgentWallet) {
    throw new NotFoundError("Recipient agent wallet not found");
  }

  if (amount > fromAgentWallet.balance) {
    throw new ServiceError("Insufficient funds");
  }

  // update sender balance
  await Wallet.updateOne(
    { agent: fromAgentId },
    { $inc: { balance: -amount } }
  );

  // update receiver balance
  await Wallet.updateOne({ agent: toAgentId }, { $inc: { balance: amount } });

  return true; // Return true if the transaction was successful
};
