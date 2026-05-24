import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { storiesRouter } from "./routes/stories";
import { authRouter } from "./routes/auth";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config({ path: "../../.env" });

const app = express();
const PORT = process.env.API_PORT || 3001;

app.use(helmet());
app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "qisas-api", timestamp: new Date() });
});

app.use("/api/auth", authRouter);
app.use("/api/stories", storiesRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✓ قصص بلا نهاية API يعمل على http://localhost:${PORT}`);
});
