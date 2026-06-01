import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { storiesRouter } from "./routes/stories";
import { authRouter } from "./routes/auth";
import { paymentsRouter } from "./routes/payments";
import { childrenRouter } from "./routes/children";
import { errorHandler } from "./middleware/errorHandler";

process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
});

try { dotenv.config({ path: "../../.env" }); } catch { /* ignore if .env missing */ }

const app = express();
const PORT = Number(process.env.PORT) || Number(process.env.API_PORT) || 3001;
const DEFAULT_ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "https://dreemi.app",
  "https://www.dreemi.app",
  "https://dreemi-app-web.vercel.app",
] as const;

function parseAllowedOrigins(value?: string): string[] {
  const parsed = String(value ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  return parsed.length > 0 ? parsed : [...DEFAULT_ALLOWED_ORIGINS];
}

const allowedOrigins = parseAllowedOrigins(process.env.ALLOWED_ORIGINS);

app.use(helmet());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

// Lemon Squeezy webhooks need the raw body for signature verification.
// Mount it BEFORE the global express.json() parser.
app.use(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "dreemi-api", timestamp: new Date() });
});

app.use("/api/auth", authRouter);
app.use("/api/stories", storiesRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/children", childrenRouter);
app.use(errorHandler);

const server = app.listen(PORT, "0.0.0.0", () => {
  const addr = server.address();
  console.log(`✓ Dreemi API listening on port ${PORT} (${JSON.stringify(addr)})`);
});

server.on("error", (err) => {
  console.error("Server error:", err);
  process.exit(1);
});
