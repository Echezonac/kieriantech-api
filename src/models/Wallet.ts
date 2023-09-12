import mongoose from "mongoose";

const walletSchema = new mongoose.Schema({
  balance: {
    type: Number,
    default: 0,
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Agent",
  },
});

export default mongoose.model("Wallet", walletSchema);
