import cors from "cors";
import "dotenv/config";
import express from "express";
import helmet from "helmet";

import { connectDB } from "./config/db";
import apiLimiter from "./config/rateLimit";
import { errorHandler } from "./middlewares/errorHandler";
import authRoutes from "./routes/auth";
import transactionRoutes from "./routes/transaction";
import agentRoutes from "./routes/agent";

connectDB();

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(helmet());

const PORT = 8001;

app.get("/", (req, res) => {
  res.send("Hello, Kieriantech!");
});

app.use("/api/", apiLimiter); // Apply rate limiting to all /api/ routes

// Define routes
app.use("/api/v1/transactions", transactionRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/agents", agentRoutes);

// Error handler middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Listening on port http://localhost:${PORT}`);
});
