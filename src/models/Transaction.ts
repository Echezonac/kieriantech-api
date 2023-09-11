import mongoose, { Document, Schema } from "mongoose";

const TransactionSchema: Schema = new Schema(
  {
    fromAgentId: {
      type: String,
      required: true,
      length: 12,
    },
    toWalletid: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Transaction", TransactionSchema);
