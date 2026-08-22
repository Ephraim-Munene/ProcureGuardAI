import { Request, Response } from "express";
import prisma from "../config/db";

export const submitContactMessage = async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body || {};

    if (!name || !email || !subject || !message) {
      return res
        .status(400)
        .json({ error: "name, email, subject and message are required" });
    }

    const emailOk = typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      return res.status(400).json({ error: "A valid email address is required" });
    }

    if (
      typeof message !== "string" ||
      message.trim().length < 10 ||
      message.length > 5000
    ) {
      return res.status(400).json({
        error: "Message must be between 10 and 5000 characters",
      });
    }

    const contact = await prisma.contactMessage.create({
      data: {
        name: String(name).trim().slice(0, 200),
        email: String(email).trim().toLowerCase(),
        subject: String(subject).trim().slice(0, 300),
        message: message.trim(),
      },
    });

    return res.status(201).json({
      id: contact.id,
      message: "Message received. Our oversight desk will respond shortly.",
    });
  } catch (err) {
    console.error("Failed to store contact message:", err);
    return res.status(500).json({ error: "Failed to submit message. Try again later." });
  }
};
