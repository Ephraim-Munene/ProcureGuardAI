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

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}
const JWT_SECRET = process.env.JWT_SECRET;

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
      return res.status(401).json({
        error: "UNAUTHORIZED",
        message: "Please sign in to continue.",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(401).json({
        error: "UNAUTHORIZED",
        message: "Your session is no longer valid. Please sign in again.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      error: "UNAUTHORIZED",
      message: "Your session has expired. Please sign in again.",
    });
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
        error: "QUOTA_REACHED",
        message: `You've used all ${maxScans} scans included in your plan for today. Upgrade your plan to keep scanning.`,
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
