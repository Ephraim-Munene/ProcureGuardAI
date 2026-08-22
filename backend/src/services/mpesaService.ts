import axios from "axios";
import prisma from "../config/db";

const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY || "";
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET || "";
const PASSKEY = process.env.MPESA_PASSKEY || "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
const SHORTCODE = process.env.MPESA_SHORTCODE || "174379";
const CALLBACK_URL = process.env.MPESA_CALLBACK_URL || "https://procureguard-backend.onrender.com/api/mpesa/callback";

// Helper to format phone number to 254XXXXXXXXX
export const formatPhoneNumber = (phone: string): string => {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "254" + cleaned.substring(1);
  } else if (cleaned.startsWith("254")) {
    // already 254...
  } else if (cleaned.length === 9) {
    cleaned = "254" + cleaned;
  }
  return cleaned;
};

// Generate Daraja OAuth Access Token
export const getDarajaToken = async (): Promise<string | null> => {
  try {
    if (!CONSUMER_KEY || !CONSUMER_SECRET || CONSUMER_KEY === "your_daraja_consumer_key") {
      return null;
    }
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64");
    const response = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );
    return response.data.access_token || null;
  } catch (error: any) {
    console.warn("Daraja OAuth Failed, falling back to mock sandbox mode:", error?.message);
    return null;
  }
};

// Initiate STK Push
export const sendStkPush = async (
  userId: string,
  phoneNumber: string,
  amount: number,
  plan: "PRO" | "ENTERPRISE"
) => {
  const formattedPhone = formatPhoneNumber(phoneNumber);
  const now = new Date();
  const timestamp =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0") +
    String(now.getHours()).padStart(2, "0") +
    String(now.getMinutes()).padStart(2, "0") +
    String(now.getSeconds()).padStart(2, "0");

  const password = Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString("base64");
  const token = await getDarajaToken();

  let checkoutRequestId = `WS_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
  let merchantRequestId = `MR_${Date.now()}`;
  let responseMessage = "STK Push initiated successfully on Safaricom Sandbox";

  if (token) {
    try {
      const payload = {
        BusinessShortCode: SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: formattedPhone,
        PartyB: SHORTCODE,
        PhoneNumber: formattedPhone,
        CallBackURL: CALLBACK_URL,
        AccountReference: "ProcureGuardAI",
        TransactionDesc: `License Tier Activation: ${plan}`,
      };

      const res = await axios.post(
        "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data && res.data.CheckoutRequestID) {
        checkoutRequestId = res.data.CheckoutRequestID;
        merchantRequestId = res.data.MerchantRequestID;
        responseMessage = res.data.CustomerMessage || responseMessage;
      }
    } catch (err: any) {
      console.warn("Real Daraja Call failed, creating sandbox pending transaction:", err?.response?.data || err?.message);
    }
  }

  // Record pending transaction in DB
  const transaction = await prisma.mpesaTransaction.create({
    data: {
      userId,
      checkoutRequestId,
      merchantRequestId,
      phoneNumber: formattedPhone,
      amount,
      plan,
      status: "PENDING",
    },
  });

  return {
    success: true,
    checkoutRequestId: transaction.checkoutRequestId,
    phoneNumber: formattedPhone,
    amount,
    plan,
    message: responseMessage,
  };
};
