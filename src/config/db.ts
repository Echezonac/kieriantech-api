import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI ||'mongodb://localhost:27017/kieriantech';

export const connectDB = async () => {
  try {
    mongoose.connect(MONGO_URI as string, {
      // directConnection: true,
    });
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
    process.exit(1);
  }
};
export default connectDB;
