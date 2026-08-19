import { Request, Response } from "express";
import { prisma } from "../config/db";
import { auditInvoiceWithGemini } from "../services/geminiService";

export const uploadAndAuditInvoice = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No invoice file uploaded." });
    }

    const { buffer, mimetype, originalname } = req.file;

    // 1. Analyze document using Gemini or dynamic forensic parser
    const auditResult = await auditInvoiceWithGemini(buffer, mimetype, originalname);

    // 2. Fetch or create default auditor user
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: "auditor@eacc.go.ke",
          name: "Lead Procurement Auditor",
          role: "AUDITOR"
        }
      });
    }

    // 3. Save Audit Results to Database via Prisma
    const invoice = await prisma.invoice.create({
      data: {
        userId: user.id,
        invoiceNumber: auditResult.invoiceNumber || `INV-${Date.now()}`,
        vendorName: auditResult.vendorName || "Unknown Supplier",
        fileUrl: `/uploads/${originalname}`,
        totalAmountKes: Number(auditResult.totalAmountKes) || 0,
        overallRiskScore: Number(auditResult.overallRiskScore) || 0,
        riskLevel: auditResult.riskLevel || "MEDIUM",
        summaryNotes: auditResult.summaryNotes || "No summary notes provided.",
        status: auditResult.overallRiskScore > 30 ? "FLAGGED" : "CLEAN",
        items: {
          create: (auditResult.items || []).map((item: any) => ({
            description: item.description || "Uncategorized Item",
            quantity: Number(item.quantity) || 1,
            invoicedUnitPriceKes: Number(item.invoicedUnitPriceKes) || 0,
            marketUnitPriceKes: Number(item.marketUnitPriceKes) || 0,
            inflationPercentage: Number(item.inflationPercentage) || 0,
            isFlagged: Boolean(item.isFlagged),
            flagReason: item.flagReason || null,
            riskLevel: item.riskLevel || "LOW",
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return res.status(201).json({ success: true, invoice });
  } catch (error) {
    console.error("Audit Processing Error:", error);
    return res.status(500).json({ error: "Failed to audit invoice document." });
  }
};

export const getInvoices = async (_req: Request, res: Response) => {
  try {
    const invoices = await prisma.invoice.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
    return res.json(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return res.status(500).json({ error: "Failed to fetch invoices." });
  }
};

export const getInvoiceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!invoice) return res.status(404).json({ error: "Invoice not found" });
    return res.json(invoice);
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return res.status(500).json({ error: "Failed to fetch invoice details." });
  }
};

export const updateInvoiceStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["CLEAN", "FLAGGED", "RESOLVED"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const updated = await prisma.invoice.update({
      where: { id },
      data: { status },
      include: { items: true },
    });

    return res.json({ success: true, invoice: updated });
  } catch (error) {
    console.error("Error updating invoice status:", error);
    return res.status(500).json({ error: "Failed to update invoice status." });
  }
};

export const getBenchmarks = async (_req: Request, res: Response) => {
  try {
    const benchmarks = await prisma.benchmarkPrice.findMany({
      orderBy: { category: "asc" },
    });
    return res.json(benchmarks);
  } catch (error) {
    console.error("Error fetching benchmarks:", error);
    return res.status(500).json({ error: "Failed to fetch market benchmarks." });
  }
};
