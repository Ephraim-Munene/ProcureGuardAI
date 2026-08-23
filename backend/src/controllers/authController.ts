import { Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/db";
import { AuthenticatedRequest, PLAN_LIMITS } from "../middlewares/authMiddleware";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}
const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, email, password, plan } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "Please fill in your name, email, and password." });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists. Try signing in instead." });
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
      message: "Account created successfully",
      token,
      user: {
        ...userWithoutPassword,
        maxDailyScans: PLAN_LIMITS[userWithoutPassword.subscriptionPlan] || 3,
      },
    });
  } catch (error: any) {
    console.error("Registration Error:", error);
    return res.status(500).json({ message: "Something went wrong while creating your account. Please try again." });
  }
};

export const login = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please enter your email and password." });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return res.status(401).json({ message: "Wrong email or password. Please try again." });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ message: "Wrong email or password. Please try again." });
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
      message: "Signed in successfully",
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
    return res.status(500).json({ message: "Something went wrong while signing you in. Please try again." });
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
