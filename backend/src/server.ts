import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import invoiceRoutes from "./routes/invoiceRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api", invoiceRoutes);

// Healthcheck
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "ProcureGuard AI API", timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`🛡️ ProcureGuard AI Backend running on port ${PORT}`);
});
