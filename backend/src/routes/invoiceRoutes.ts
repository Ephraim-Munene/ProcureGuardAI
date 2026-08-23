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
import { requireAdmin } from "../middlewares/authMiddleware";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
]);

/**
 * Verifies the file starts with a known magic-byte signature so a renamed
 * .exe cannot masquerade as an invoice.
 */
function hasValidMagicBytes(buffer: Buffer): boolean {
  if (buffer.length < 8) return false;
  // PDF: %PDF-
  if (buffer.subarray(0, 5).toString("ascii") === "%PDF-") return true;
  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return true;
  // PNG: 89 50 4E 47
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return true;
  }
  return false;
}

/**
 * Middleware that parses multipart/form-data using Busboy.
 * On success, attaches `req.file` (first uploaded file) for the controller.
 * Enforces size limits and file-type allowlist.
 */
const parseInvoiceUpload = (req: Request, res: Response, next: NextFunction): void => {
  // Determine the boundary from the Content-Type header
  const contentType = req.headers["content-type"] || "";
  if (!contentType.startsWith("multipart/form-data")) {
    return next();
  }

  const contentLength = Number(req.headers["content-length"] || 0);
  if (contentLength > MAX_FILE_SIZE + 64 * 1024) {
    res.status(413).json({ error: "File too large. Maximum upload size is 10MB." });
    return;
  }

  try {
    const fields = new URLSearchParams(contentType.replace(/^multipart\/form-data;\s*/, ""));
    const boundary = fields.get("boundary");
    if (!boundary) {
      return next(new Error("No boundary found in multipart request"));
    }

    let rejected = false;
    let rejectReason: "size" | "type" | null = null;

    const bb = busboy({
      headers: { "content-type": `multipart/form-data; boundary=${boundary}` },
      limits: { fileSize: MAX_FILE_SIZE, files: 1, fields: 10 },
    });

    bb.on("file", (name: string, stream: Readable, info: { filename: string; mimeType: string }) => {
      const chunks: Buffer[] = [];
      stream.on("data", (chunk: Buffer) => chunks.push(chunk));
      stream.on("limit", () => {
        rejected = true;
        rejectReason = "size";
      });
      stream.on("end", () => {
        if (rejected) return;
        const buffer = Buffer.concat(chunks);
        if (buffer.length > MAX_FILE_SIZE) {
          rejected = true;
          rejectReason = "size";
          return;
        }
        if (!ALLOWED_MIME_TYPES.has(info.mimeType)) {
          rejected = true;
          rejectReason = "type";
          return;
        }
        if (!hasValidMagicBytes(buffer)) {
          rejected = true;
          rejectReason = "type";
          return;
        }
        (req as any).file = {
          fieldname: name,
          buffer,
          mimetype: info.mimeType,
          originalname: info.filename,
          encoding: "7bit",
          size: buffer.length,
        };
      });
    });

    bb.on("finish", () => {
      if (rejected) {
        delete (req as any).file;
        if (rejectReason === "size") {
          res.status(413).json({ error: "File too large. Maximum upload size is 10MB." });
        } else {
          res.status(415).json({
            error: "Unsupported file type. Please upload a PDF, JPG, or PNG invoice.",
          });
        }
        return;
      }
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
router.post("/benchmarks", requireAdmin, createBenchmark);
router.put("/benchmarks/:id", requireAdmin, updateBenchmark);
router.delete("/benchmarks/:id", requireAdmin, deleteBenchmark);
router.get("/settings", getSettings);
router.put("/settings", requireAdmin, updateSettings);

export default router;
