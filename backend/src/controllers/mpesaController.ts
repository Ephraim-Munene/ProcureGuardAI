import { Request, Response } from "express";
import prisma from "../config/db";
import { sendStkPush, formatPhoneNumber } from "../services/mpesaService";
import { AuthenticatedRequest, PLAN_LIMITS } from "../middlewares/authMiddleware";

// Initiate STK Push
export const initiatePayment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { phoneNumber, plan } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Authentication required to initiate payment" });
    }

    if (!phoneNumber || !plan) {
      return res.status(400).json({ error: "Phone number and plan are required" });
    }

    const selectedPlan = plan.toUpperCase();
    if (!["PRO", "ENTERPRISE"].includes(selectedPlan)) {
      return res.status(400).json({ error: "Invalid plan selected for M-Pesa payment" });
    }

    const amount = selectedPlan === "PRO" ? 10 : 20;

    const result = await sendStkPush(userId, phoneNumber, amount, selectedPlan as "PRO" | "ENTERPRISE");

    return res.json(result);
  } catch (error: any) {
    console.error("STK Push error:", error);
    return res.status(500).json({ error: "Failed to initiate M-Pesa payment", details: error.message });
  }
};

// Daraja Webhook Callback
export const handleMpesaCallback = async (req: Request, res: Response) => {
  try {
    console.log("📥 M-Pesa Callback Received:", JSON.stringify(req.body, null, 2));

    const stkCallback = req.body?.Body?.stkCallback;
    if (!stkCallback) {
      return res.status(400).json({ ResultCode: 1, ResultDesc: "Invalid callback payload" });
    }

    const checkoutRequestId = stkCallback.CheckoutRequestID;
    const resultCode = stkCallback.ResultCode;
    const resultDesc = stkCallback.ResultDesc;

    const transaction = await prisma.mpesaTransaction.findUnique({
      where: { checkoutRequestId },
    });

    if (!transaction) {
      console.warn("Transaction not found for checkoutRequestId:", checkoutRequestId);
      return res.json({ ResultCode: 0, ResultDesc: "Accepted" });
    }

    if (resultCode === 0) {
      // Payment Successful!
      let receiptNumber = "";
      const metaItems = stkCallback.CallbackMetadata?.Item || [];
      for (const item of metaItems) {
        if (item.Name === "MpesaReceiptNumber") {
          receiptNumber = item.Value;
        }
      }

      await prisma.$transaction([
        prisma.mpesaTransaction.update({
          where: { checkoutRequestId },
          data: {
            status: "SUCCESS",
            mpesaReceiptNumber: receiptNumber || `MPESA_${Date.now()}`,
            resultDesc: resultDesc || "Success",
          },
        }),
        prisma.user.update({
          where: { id: transaction.userId },
          data: {
            subscriptionPlan: transaction.plan,
            subscriptionStatus: "ACTIVE",
          },
        }),
      ]);

      console.log(`✅ Subscription upgraded to ${transaction.plan} for user ${transaction.userId}`);
    } else {
      // Payment Failed / Cancelled
      await prisma.mpesaTransaction.update({
        where: { checkoutRequestId },
        data: {
          status: "FAILED",
          resultDesc: resultDesc || "Payment failed or cancelled by user",
        },
      });
      console.log(`❌ M-Pesa payment failed for checkoutRequestId: ${checkoutRequestId}`);
    }

    return res.json({ ResultCode: 0, ResultDesc: "Accepted" });
  } catch (error: any) {
    console.error("Error processing M-Pesa callback:", error);
    return res.status(500).json({ ResultCode: 1, ResultDesc: "Internal Server Error" });
  }
};

// Query status of a payment (polled by frontend skeleton)
export const checkPaymentStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { checkoutRequestId } = req.params;

    const transaction = await prisma.mpesaTransaction.findUnique({
      where: { checkoutRequestId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            subscriptionPlan: true,
            subscriptionStatus: true,
            dailyScanCount: true,
            lastScanDate: true,
          },
        },
      },
    });

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    return res.json({
      checkoutRequestId: transaction.checkoutRequestId,
      status: transaction.status,
      receiptNumber: transaction.mpesaReceiptNumber,
      plan: transaction.plan,
      amount: transaction.amount,
      user: {
        ...transaction.user,
        maxDailyScans: PLAN_LIMITS[transaction.user.subscriptionPlan] || 3,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to check transaction status" });
  }
};

// Simulation endpoint for Demo/Testing
export const simulateSuccessfulPayment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { checkoutRequestId } = req.body;

    const transaction = await prisma.mpesaTransaction.findUnique({
      where: { checkoutRequestId },
    });

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    const receiptNumber = `NLJ${Math.floor(10000000 + Math.random() * 90000000)}`;

    const [updatedTx, updatedUser] = await prisma.$transaction([
      prisma.mpesaTransaction.update({
        where: { checkoutRequestId },
        data: {
          status: "SUCCESS",
          mpesaReceiptNumber: receiptNumber,
          resultDesc: "Simulated successful M-Pesa Sandbox Payment",
        },
      }),
      prisma.user.update({
        where: { id: transaction.userId },
        data: {
          subscriptionPlan: transaction.plan,
          subscriptionStatus: "ACTIVE",
        },
      }),
    ]);

    return res.json({
      message: `Simulated M-Pesa payment success for plan ${transaction.plan}`,
      status: "SUCCESS",
      receiptNumber,
      user: {
        ...updatedUser,
        maxDailyScans: PLAN_LIMITS[updatedUser.subscriptionPlan] || 3,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ error: "Simulation failed", details: error.message });
  }
};
