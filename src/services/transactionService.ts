import { NotFoundError } from "../customErrors";
import Agent from "../models/Agent";
import Wallet from "../models/Wallet";

export const transferFunds = async (fromAgentId: string, toWalletId: string, amount: number) => {
    // Fetch the agent's balance from the db
    const agent = await Agent.findOne({ agentId: fromAgentId });
    if (!agent) {
        throw new NotFoundError('Agent not found')
    }

    if (amount > agent.balance) {
        throw new Error('Insufficient funds')
    }

    // Fetch the recipient's wallet from the database
    const wallet = await Wallet.findOne({ walletId: toWalletId });
    if (!wallet) {
        throw new NotFoundError('Wallet not found');
    }

    // Update the agent's and wallet's balance
    agent.balance -= amount;
    wallet.balance += amount;

    // Save the updated agent and wallet
    await agent.save();
    await wallet.save();

    return true; // Return true if the transaction was successful
}