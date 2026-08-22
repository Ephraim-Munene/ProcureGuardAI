import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import invoiceRoutes from "./routes/invoiceRoutes";
import authRoutes from "./routes/authRoutes";
import mpesaRoutes from "./routes/mpesaRoutes";
import { authenticateUser, enforceDailyScanQuota } from "./middlewares/authMiddleware";

dotenv.config();

export const createApp = (): Express => {
  const app = express();

  app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Public API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/mpesa", mpesaRoutes);

  // Protected invoice routes (Authentication + Daily quota enforcement)
  const protectedInvoiceRoutes = express.Router();
  protectedInvoiceRoutes.use(authenticateUser, enforceDailyScanQuota);
  protectedInvoiceRoutes.use("/", invoiceRoutes);
  app.use("/api", protectedInvoiceRoutes);

  // Healthcheck
  app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "ProcureGuard AI API", timestamp: new Date() });
  });

  // 404 catch-all
  app.all("*", (_req, res) => {
    res.status(404).json({ error: "Not Found" });
  });

  return app;
};

// Only start the server if this file is executed directly (not imported by serverless)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  const app = createApp();
  app.listen(PORT, () => {
    console.log(`ProcureGuard AI Backend running on port ${PORT}`);
  });
}
