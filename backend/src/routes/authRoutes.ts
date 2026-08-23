import { Router } from "express";
import { register, login, getMe } from "../controllers/authController";
import { authenticateUser } from "../middlewares/authMiddleware";
import { authLimiter } from "../middlewares/rateLimiters";

const router = Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.get("/me", authenticateUser, getMe);

export default router;
