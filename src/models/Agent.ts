import bcrypt from "bcryptjs";
import mongoose, { Document, Schema } from "mongoose";

const AgentSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
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

AgentSchema.pre("save", async function (next) {
  if (this.isModified("pin") || this.isNew) {
    const salt = await bcrypt.genSalt(10);
    this.pin = await bcrypt.hash(this.pin, salt);
  }
  next();
});

AgentSchema.methods.comparePin = async function (
  pin: string
): Promise<boolean> {
  return bcrypt.compare(pin, this.pin);
};

export default mongoose.model("Agent", AgentSchema);
