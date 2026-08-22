import { Router } from "express";
import multer from "multer";
import {
  uploadAndAuditInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoiceStatus,
  getBenchmarks,
  createBenchmark,
  updateBenchmark,
  deleteBenchmark,
  getSettings,
  updateSettings
} from "../controllers/invoiceController";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

const router = Router();

router.post("/audit", upload.single("invoice"), uploadAndAuditInvoice);
router.get("/invoices", getInvoices);
router.get("/invoices/:id", getInvoiceById);
router.patch("/invoices/:id/status", updateInvoiceStatus);
router.get("/benchmarks", getBenchmarks);
router.post("/benchmarks", createBenchmark);
router.put("/benchmarks/:id", updateBenchmark);
router.delete("/benchmarks/:id", deleteBenchmark);
router.get("/settings", getSettings);
router.put("/settings", updateSettings);

export default router;