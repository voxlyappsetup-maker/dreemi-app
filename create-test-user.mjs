import { PrismaClient } from "@prisma/client";

const dbUrl = String(process.env.DATABASE_URL ?? "").trim();
if (!dbUrl) {
  throw new Error("DATABASE_URL is required in environment before running this local script.");
}

const prisma = new PrismaClient();

const user = await prisma.user.upsert({
  where:  { email: "test@dreemi.app" },
  update: {},
  create: {
    id:    "test-user-001",
    email: "test@dreemi.app",
    name:  "مستخدم الاختبار",
    plan:  "FREE",
  },
});

console.log("✓ المستخدم جاهز:", user.id, user.email);
await prisma.$disconnect();