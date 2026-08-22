import { PrismaClient } from "@prisma/client";

// Lazy-initialized Prisma client to avoid cold-start crashes in serverless.
let prismaInstance: PrismaClient | null = null;

export const getPrisma = (): PrismaClient => {
  if (!prismaInstance) {
    console.log("[DB] Initializing Prisma client...");
    prismaInstance = new PrismaClient();
    console.log("[DB] Prisma client initialized successfully.");
  }
  return prismaInstance;
};

// For backward compatibility with imports that use ` prisma` directly,
// export a proxy that lazily initializes on first access.
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrisma();
    return client[prop as keyof PrismaClient];
  },
});

export default prisma;
