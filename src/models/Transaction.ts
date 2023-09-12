import mongoose, { Document, Schema } from "mongoose";

const TransactionSchema: Schema = new Schema(
  {
    fromAgent: {
      type: String,
      ref: 'Agent',
    },
    toAgent: {
      type: String,
      ref: 'Agent'
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
