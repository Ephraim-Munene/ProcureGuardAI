import { Router } from "express";
import {
  initiatePayment,
  handleMpesaCallback,
  checkPaymentStatus,
  simulateSuccessfulPayment,
} from "../controllers/mpesaController";
import { authenticateUser } from "../middlewares/authMiddleware";

const router = Router();

// STK Push request
router.post("/stkpush", authenticateUser, initiatePayment);

// Daraja Webhook Callback (unprotected as Safaricom posts directly)
router.post("/callback", handleMpesaCallback);

// Polling status
router.get("/status/:checkoutRequestId", authenticateUser, checkPaymentStatus);

// Simulation route for Sandbox / Demo
router.post("/simulate", authenticateUser, simulateSuccessfulPayment);

export default router;
