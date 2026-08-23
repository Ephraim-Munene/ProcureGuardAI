import rateLimit from "express-rate-limit";
import { Request, Response } from "express";

const isTest = process.env.NODE_ENV === "test";

/**
 * In-memory limiters (per serverless instance). Good enough as a brake;
 * swap for a shared store (e.g. Upstash Redis) if abuse becomes a concern.
 */

const handler = (_req: Request, res: Response) => {
  res.status(429).json({
    error: "RATE_LIMITED",
    message: "Too many attempts. Please wait a few minutes and try again.",
  });
};

// Strict: brute-force protection on sign-in / account creation
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
  skip: () => isTest,
});

// Moderate: contact form spam
export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
  skip: () => isTest,
});

// General brake for the rest of the API
export const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
  skip: () => isTest,
});
