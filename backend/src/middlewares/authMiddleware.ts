import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../config/db";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
    subscriptionPlan: string;
    subscriptionStatus: string;
    dailyScanCount: number;
    lastScanDate: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || "procureguard_super_secret_jwt_key_2026";

export const PLAN_LIMITS: Record<string, number> = {
  FREE: 3,
  PRO: 50,
  ENTERPRISE: 500,
};

export const authenticateUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      // Fallback to demo default user if present in DB or bypass for dev
      const defaultUser = await prisma.user.findFirst();
      if (defaultUser) {
        req.user = defaultUser;
        return next();
      }
      return res.status(401).json({ error: "Authentication token required" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(401).json({ error: "User not found or token invalid" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired authorization token" });
  }
};

export const enforceDailyScanQuota = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized operation" });
    }

    const user = req.user;
    const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const maxScans = PLAN_LIMITS[user.subscriptionPlan] || 3;

    // Reset daily count if date has changed
    let currentScanCount = user.dailyScanCount;
    if (user.lastScanDate !== todayStr) {
      currentScanCount = 0;
      await prisma.user.update({
        where: { id: user.id },
        data: {
          dailyScanCount: 0,
          lastScanDate: todayStr,
        },
      });
      req.user.dailyScanCount = 0;
      req.user.lastScanDate = todayStr;
    }

    if (currentScanCount >= maxScans) {
      return res.status(403).json({
        error: `Daily scan quota reached for Tier ${user.subscriptionPlan}`,
        message: `Your current tier (${user.subscriptionPlan}) allows ${maxScans} scans per day. Upgrade your plan to scan more invoices today!`,
        plan: user.subscriptionPlan,
        limit: maxScans,
        used: currentScanCount,
      });
    }

    next();
  } catch (error) {
    console.error("Quota enforcement error:", error);
    next();
  }
};
