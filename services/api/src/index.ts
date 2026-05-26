import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { storiesRouter } from "./routes/stories";
import { authRouter } from "./routes/auth";
import { paymentsRouter } from "./routes/payments";
import { childrenRouter } from "./routes/children";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config({ path: "../../.env" });

const app = express();
const PORT = process.env.PORT || process.env.API_PORT || 3001;

app.use(helmet());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://dreemi.app",
      "https://www.dreemi.app",
      "https://dreemi-app-web.vercel.app",
    ],
    credentials: true,
  }),
);

// Stripe webhooks need the raw body for signature verification.
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

app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`✓ Dreemi API يعمل على http://0.0.0.0:${PORT}`);
});
