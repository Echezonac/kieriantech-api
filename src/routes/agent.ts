import express from "express";
import { getAll, register } from "../controllers/agentController";
import { auth } from "../middlewares/auth";
import { validateUserRegistration } from "../validation/user.schema";

const router = express.Router();

router.get("/", getAll);

router.post('/', validateUserRegistration, register);

export default router;
