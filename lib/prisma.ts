import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";

import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function makePrisma() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Make sure .env is loaded before accessing the database."
    );
  }
  
  const pool = new Pool({
    connectionString: url,
    max: 3, // Prevent 11 build workers from exceeding Neon's 100 connection limit
  });

  return new PrismaClient({
    adapter: new PrismaPg(pool),
  });
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop: string | symbol) {
    const client = globalForPrisma.prisma ?? (globalForPrisma.prisma = makePrisma());
    return (client as any)[prop];
  },
});
