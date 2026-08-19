import { PrismaClient } from "@prisma/client";

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

  // Create default auditor user
  await prisma.user.upsert({
    where: { email: "auditor@eacc.go.ke" },
    update: {},
    create: {
      email: "auditor@eacc.go.ke",
      name: "Lead Procurement Auditor",
      role: "AUDITOR",
    },
  });

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
