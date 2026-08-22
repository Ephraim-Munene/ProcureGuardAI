import { Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/db";
import { AuthenticatedRequest, PLAN_LIMITS } from "../middlewares/authMiddleware";

const JWT_SECRET = process.env.JWT_SECRET || "procureguard_super_secret_jwt_key_2026";

export const register = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, email, password, plan } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: "Name, Email and Password are required" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return res.status(400).json({ error: "An account with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const selectedPlan = (plan && ["FREE", "PRO", "ENTERPRISE"].includes(plan.toUpperCase())) ? plan.toUpperCase() : "FREE";
    
    // Check if this is the very first user, if so make them SUPERADMIN
    const userCount = await prisma.user.count();
    const role = userCount === 0 ? "SUPERADMIN" : "AUDITOR";

    const todayStr = new Date().toISOString().split("T")[0];

    const newUser = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        passwordHash: hashedPassword,
        role,
        subscriptionPlan: selectedPlan,
        subscriptionStatus: "ACTIVE",
        dailyScanCount: 0,
        lastScanDate: todayStr,
      },
    });

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { passwordHash, ...userWithoutPassword } = newUser;

    return res.status(201).json({
      message: "Agent provisioned successfully",
      token,
      user: {
        ...userWithoutPassword,
        maxDailyScans: PLAN_LIMITS[userWithoutPassword.subscriptionPlan] || 3,
      },
    });
  } catch (error: any) {
    console.error("Registration Error:", error);
    return res.status(500).json({ error: "Failed to register user", details: error.message });
  }
};

export const login = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const todayStr = new Date().toISOString().split("T")[0];
    let dailyScanCount = user.dailyScanCount;

    if (user.lastScanDate !== todayStr) {
      dailyScanCount = 0;
      await prisma.user.update({
        where: { id: user.id },
        data: { dailyScanCount: 0, lastScanDate: todayStr },
      });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { passwordHash, ...userWithoutPassword } = user;

    return res.json({
      message: "Authentication successful",
      token,
      user: {
        ...userWithoutPassword,
        dailyScanCount,
        lastScanDate: todayStr,
        maxDailyScans: PLAN_LIMITS[userWithoutPassword.subscriptionPlan] || 3,
      },
    });
  } catch (error: any) {
    console.error("Login Error:", error);
    return res.status(500).json({ error: "Failed to authenticate", details: error.message });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const todayStr = new Date().toISOString().split("T")[0];
    let dailyScanCount = req.user.dailyScanCount;

    if (req.user.lastScanDate !== todayStr) {
      dailyScanCount = 0;
      await prisma.user.update({
        where: { id: req.user.id },
        data: { dailyScanCount: 0, lastScanDate: todayStr },
      });
    }

    const { passwordHash, ...userWithoutPassword } = req.user as any;

    return res.json({
      user: {
        ...userWithoutPassword,
        dailyScanCount,
        lastScanDate: todayStr,
        maxDailyScans: PLAN_LIMITS[userWithoutPassword.subscriptionPlan] || 3,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to fetch user profile" });
  }
};
