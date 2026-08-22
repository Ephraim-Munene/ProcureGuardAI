import { Request, Response } from "express";
import { prisma } from "../config/db";
import { auditInvoiceWithGemini } from "../services/geminiService";

export const uploadAndAuditInvoice = async (req: Request, res: Response) => {
  try {
    const file = (req as any).file;
    if (!file) {
      return res.status(400).json({ error: "No invoice file uploaded." });
    }

    const { buffer, mimetype, originalname } = file;

    // 1. Analyze document using Gemini or dynamic forensic parser
    const auditResult = await auditInvoiceWithGemini(buffer, mimetype, originalname);

    // 2. Fetch authenticated user or create default auditor user
    const authenticatedUser = (req as any).user;
    let userId = authenticatedUser?.id;

    if (!userId) {
      let defaultUser = await prisma.user.findFirst();
      if (!defaultUser) {
        defaultUser = await prisma.user.create({
          data: {
            email: "auditor@procureguard.go.ke",
            name: "Lead Procurement Auditor",
            role: "AUDITOR",
            subscriptionPlan: "FREE",
          }
        });
      }
      userId = defaultUser.id;
    }

    // 3. Save Audit Results to Database via Prisma
    const invoice = await prisma.invoice.create({
      data: {
        userId,
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

    // Increment user's dailyScanCount
    const todayStr = new Date().toISOString().split("T")[0];
    await prisma.user.update({
      where: { id: userId },
      data: {
        dailyScanCount: { increment: 1 },
        lastScanDate: todayStr,
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

export const createBenchmark = async (req: Request, res: Response) => {
  try {
    const { itemName, category, averageMarketPriceKes, maxAllowedPriceKes } = req.body;
    if (!itemName || !category || averageMarketPriceKes == null || maxAllowedPriceKes == null) {
      return res.status(400).json({ error: "itemName, category, averageMarketPriceKes and maxAllowedPriceKes are required." });
    }
    const benchmark = await prisma.benchmarkPrice.create({
      data: {
        itemName,
        category,
        averageMarketPriceKes: Number(averageMarketPriceKes),
        maxAllowedPriceKes: Number(maxAllowedPriceKes),
      },
    });
    return res.status(201).json({ success: true, benchmark });
  } catch (error) {
    console.error("Error creating benchmark:", error);
    return res.status(500).json({ error: "Failed to create market benchmark." });
  }
};

export const updateBenchmark = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { itemName, category, averageMarketPriceKes, maxAllowedPriceKes } = req.body;
    const updated = await prisma.benchmarkPrice.update({
      where: { id },
      data: {
        ...(itemName !== undefined && { itemName }),
        ...(category !== undefined && { category }),
        ...(averageMarketPriceKes !== undefined && { averageMarketPriceKes: Number(averageMarketPriceKes) }),
        ...(maxAllowedPriceKes !== undefined && { maxAllowedPriceKes: Number(maxAllowedPriceKes) }),
      },
    });
    return res.json({ success: true, benchmark: updated });
  } catch (error) {
    console.error("Error updating benchmark:", error);
    return res.status(500).json({ error: "Failed to update market benchmark." });
  }
};

export const deleteBenchmark = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.benchmarkPrice.delete({ where: { id } });
    return res.json({ success: true });
  } catch (error) {
    console.error("Error deleting benchmark:", error);
    return res.status(500).json({ error: "Failed to delete market benchmark." });
  }
};

export const getSettings = async (_req: Request, res: Response) => {
  try {
    const settings = await prisma.setting.findMany();
    const map: Record<string, string> = {};
    settings.forEach((s) => { map[s.key] = s.value; });
    return res.json(map);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return res.status(500).json({ error: "Failed to fetch settings." });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const entries = req.body && typeof req.body === "object" ? req.body : {};
    for (const key of Object.keys(entries)) {
      const value = typeof entries[key] === "string" ? entries[key] : JSON.stringify(entries[key]);
      await prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    }
    const settings = await prisma.setting.findMany();
    const map: Record<string, string> = {};
    settings.forEach((s) => { map[s.key] = s.value; });
    return res.json({ success: true, settings: map });
  } catch (error) {
    console.error("Error updating settings:", error);
    return res.status(500).json({ error: "Failed to update settings." });
  }
};
