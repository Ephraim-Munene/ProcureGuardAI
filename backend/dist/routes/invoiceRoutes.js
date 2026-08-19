"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const invoiceController_1 = require("../controllers/invoiceController");
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});
const router = (0, express_1.Router)();
router.post("/audit", upload.single("invoice"), invoiceController_1.uploadAndAuditInvoice);
router.get("/invoices", invoiceController_1.getInvoices);
router.get("/invoices/:id", invoiceController_1.getInvoiceById);
router.patch("/invoices/:id/status", invoiceController_1.updateInvoiceStatus);
router.get("/benchmarks", invoiceController_1.getBenchmarks);
exports.default = router;
