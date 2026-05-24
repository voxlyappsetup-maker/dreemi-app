import { Router } from "express";
export const authRouter = Router();

authRouter.get("/", (_req, res) => {
  res.json({ message: "Auth route - قيد البناء" });
});
