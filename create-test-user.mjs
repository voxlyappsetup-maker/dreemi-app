import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";

const env = readFileSync("C:/Projects/qisas-app/.env", "utf8");
const dbUrl = env.match(/DATABASE_URL="?([^"\n]+)"?/)?.[1];
process.env.DATABASE_URL = dbUrl;

const prisma = new PrismaClient();

const user = await prisma.user.upsert({
  where:  { email: "test@qisas.app" },
  update: {},
  create: {
    id:    "test-user-001",
    email: "test@qisas.app",
    name:  "مستخدم الاختبار",
    plan:  "FREE",
  },
});

console.log("✓ المستخدم جاهز:", user.id, user.email);
await prisma.$disconnect();