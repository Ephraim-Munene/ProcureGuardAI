import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding PPRA Market Price Benchmarks...");

  const benchmarks = [
    { itemName: "Bic Ballpoint Pen", category: "Stationery", averageMarketPriceKes: 25, maxAllowedPriceKes: 30 },
    { itemName: "A4 Printing Paper (Ream)", category: "Stationery", averageMarketPriceKes: 800, maxAllowedPriceKes: 950 },
    { itemName: "Ergonomic Office Chair", category: "Furniture", averageMarketPriceKes: 18000, maxAllowedPriceKes: 25000 },
    { itemName: "Core i5 Laptop 16GB", category: "Electronics", averageMarketPriceKes: 75000, maxAllowedPriceKes: 90000 },
    { itemName: "Executive Mahogany Desk", category: "Furniture", averageMarketPriceKes: 45000, maxAllowedPriceKes: 60000 },
    { itemName: "Desktop LED Monitor 24-inch", category: "Electronics", averageMarketPriceKes: 22000, maxAllowedPriceKes: 28000 },
    { itemName: "Commercial Bottled Water 500ml", category: "Supplies", averageMarketPriceKes: 60, maxAllowedPriceKes: 100 },
    { itemName: "Hand Sanitizer 500ml", category: "Supplies", averageMarketPriceKes: 300, maxAllowedPriceKes: 400 },
  ];

  for (const item of benchmarks) {
    await prisma.benchmarkPrice.upsert({
      where: { itemName: item.itemName },
      update: {},
      create: item,
    });
  }

  // Create manually-defined SUPERADMIN account
  const superadminEmail = "superadmin@procureguard.go.ke";
  const existingSuperAdmin = await prisma.user.findUnique({
    where: { email: superadminEmail },
  });

  if (!existingSuperAdmin) {
    const hashedPassword = await bcrypt.hash("ChangeMe@2026#", 10);
    await prisma.user.create({
      data: {
        email: superadminEmail,
        passwordHash: hashedPassword,
        name: "System Super Administrator",
        role: "SUPERADMIN",
        subscriptionPlan: "ENTERPRISE",
        subscriptionStatus: "ACTIVE",
        dailyScanCount: 0,
        lastScanDate: new Date().toISOString().split("T")[0],
      },
    });
    console.log("Created Superadmin account:", superadminEmail);
  }

  // Default auditor user (for legacy testing)
  await prisma.user.upsert({
    where: { email: "auditor@procureguard.go.ke" },
    update: {
      role: "AUDITOR",
    },
    create: {
      email: "auditor@procureguard.go.ke",
      name: "Lead Procurement Auditor",
      role: "AUDITOR",
      subscriptionPlan: "FREE",
    },
  });

  // Default application settings
  const defaults: Record<string, string> = {
    riskCriticalThreshold: "75",
    riskHighThreshold: "50",
    riskFlagThreshold: "30",
    baseline: "PPRA Baseline 2026",
    departments: JSON.stringify([
      "Finance",
      "Health",
      "Education",
      "Infrastructure",
      "Agriculture",
      "Water & Sanitation",
    ]),
  };

  for (const [key, value] of Object.entries(defaults)) {
    await prisma.setting.upsert({
      where: { key },
      update: {},
      create: { key, value },
    });
  }

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
