import { Router } from "express";
import { submitContactMessage } from "../controllers/contactController";
import { contactLimiter } from "../middlewares/rateLimiters";

const router = Router();

router.post("/", contactLimiter, submitContactMessage);

export default router;
