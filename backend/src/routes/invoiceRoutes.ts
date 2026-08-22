import { Router, Request, Response, NextFunction } from "express";
import busboy from "busboy";
import type { Readable } from "stream";
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

/**
 * Middleware that parses multipart/form-data using Busboy.
 * On success, attaches `req.file` (first uploaded file) for the controller.
 */
const parseInvoiceUpload = (req: Request, res: Response, next: NextFunction): void => {
  // Determine the boundary from the Content-Type header
  const contentType = req.headers["content-type"] || "";
  if (!contentType.startsWith("multipart/form-data")) {
    return next();
  }

  try {
    const fields = new URLSearchParams(contentType.replace(/^multipart\/form-data;\s*/, ""));
    const boundary = fields.get("boundary");
    if (!boundary) {
      return next(new Error("No boundary found in multipart request"));
    }

    const bb = busboy({ headers: { "content-type": `multipart/form-data; boundary=${boundary}` } });

    bb.on("file", (name: string, stream: Readable, info: { filename: string; mimeType: string }) => {
      const chunks: Buffer[] = [];
      stream.on("data", (chunk: Buffer) => chunks.push(chunk));
      stream.on("end", () => {
        (req as any).file = {
          fieldname: name,
          buffer: Buffer.concat(chunks),
          mimetype: info.mimeType,
          originalname: info.filename,
          encoding: "7bit",
          size: Buffer.concat(chunks).length,
        };
      });
    });

    bb.on("finish", () => {
      next();
    });

    bb.on("error", (err: Error) => {
      console.error("Busboy parsing error:", err);
      return next(new Error("Failed to parse multipart request"));
    });

    req.pipe(bb);
  } catch (err) {
    console.error("Upload middleware error:", err);
    return next(new Error("Failed to process upload request"));
  }
};

const router = Router();

router.post("/audit", parseInvoiceUpload, uploadAndAuditInvoice);
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
