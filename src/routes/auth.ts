import express from "express";
import { getLoggedInUser, login } from "../controllers/authController";
import { auth } from "../middlewares/auth";

const router = express.Router();

// Log in user
router.post("/", login);

// Get logged in user
router.get("/me", auth, getLoggedInUser);

export default router;
