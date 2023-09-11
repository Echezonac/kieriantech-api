import bcrypt from "bcryptjs";
import mongoose, { Document, Schema } from "mongoose";

const AgentSchema: Schema = new Schema(
  {
    agentId: {
      type: String,
      // required: true,
      // unique: true,
      // length: 12,
    },
    balance: {
      type: Number,
      default: 0,
    },
    pin: {
      type: String,
      required: true,
      length: 4,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Agent", AgentSchema);

