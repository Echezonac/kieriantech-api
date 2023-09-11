import mongoose from "mongoose";
import connectDB from "../config/db";
import Agent from "../models/Agent";
import Wallet from "../models/Wallet";
import Transaction from "../models/Transaction";

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/kieriantech";

console.log(process.env.MONGO_URI);

const seedData = async () => {
  (async () => {
    try {
      mongoose.connect(MONGO_URI as string, {
        // directConnection: true,
      });
      console.log("MongoDB Connected...");
    } catch (err) {
      console.error("Error connecting to MongoDB", err);
      process.exit(1);
    }
  })();

  // Seed Agents
  const agents = [
    {
      _id: new mongoose.Types.ObjectId(),
      agentId: "AGENT00000001",
      balance: 1000,
      pin: "1234", // This should be hashed in a real-world scenario
    },
    {
      _id: new mongoose.Types.ObjectId(),
      agentId: "AGENT00000002",
      balance: 1500,
      pin: "5678",
    },
  ];

  await Agent.insertMany(agents);

  // Seed Wallets
  const wallets = [
    {
      _id: new mongoose.Types.ObjectId(),
      walletId: "WALLET000001",
      balance: 0,
    },
    {
      _id: new mongoose.Types.ObjectId(),
      walletId: "WALLET000002",
      balance: 0,
    },
  ];

  await Wallet.insertMany(wallets);

  // Seed Transactions (as an example)
  const transactions = [
    {
      fromAgentId: "AGENT00000001",
      toWalletId: wallets[0].walletId,
      amount: 100,
    },
    {
      fromAgentId: "AGENT00000002",
      toWalletId: wallets[1].walletId,
      amount: 150,
    },
  ];

  await Transaction.insertMany(transactions);

  console.log("Data seeded successfully!");
  process.exit();
};

seedData();
