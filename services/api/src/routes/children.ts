import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../services/prisma.service";
import { authenticateToken } from "../middleware/auth.middleware";

export const childrenRouter = Router();

const CHILD_LIMITS: Record<string, number> = {
  FREE: 1,
  INDIVIDUAL: 1,
  FAMILY: 4,
  SCHOOL: Infinity,
};

const PERSONALITIES = ["curious", "brave", "calm", "energetic", "creative", "kind", "funny", "shy"] as const;
const ANIMALS = ["cat", "dog", "rabbit", "horse", "bird", "fish", "turtle", "dinosaur"] as const;

const CreateChildSchema = z.object({
  name: z.string().min(1).max(50),
  age: z.number().int().min(1).max(18),
  gender: z.enum(["boy", "girl"]).default("boy"),
  skinTone: z.enum(["light", "medium", "dark"]).default("medium"),
  hairColor: z.enum(["black", "brown", "blonde", "red"]).default("black"),
  personality: z.enum(PERSONALITIES).nullable().optional(),
  hobbies: z.string().max(200).nullable().optional(),
  favAnimal: z.enum(ANIMALS).nullable().optional(),
  avatarUrl: z.string().url().optional(),
});

const UpdateChildSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  age: z.number().int().min(1).max(18).optional(),
  gender: z.enum(["boy", "girl"]).optional(),
  skinTone: z.enum(["light", "medium", "dark"]).optional(),
  hairColor: z.enum(["black", "brown", "blonde", "red"]).optional(),
  personality: z.enum(PERSONALITIES).nullable().optional(),
  hobbies: z.string().max(200).nullable().optional(),
  favAnimal: z.enum(ANIMALS).nullable().optional(),
  avatarUrl: z.string().url().nullable().optional(),
});

childrenRouter.get("/", authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: "Token required" });
      return;
    }

    const children = await prisma.child.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
      include: { _count: { select: { stories: true } } },
    });

    res.json({ success: true, children });
  } catch (error) {
    console.error("[Children] fetch error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch children" });
  }
});

childrenRouter.post("/", authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: "Token required" });
      return;
    }

    const input = CreateChildSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true },
    });
    if (!user) {
      res.status(404).json({ success: false, error: "User not found" });
      return;
    }

    const currentCount = await prisma.child.count({ where: { userId } });
    const limit = CHILD_LIMITS[user.plan] ?? 1;

    if (currentCount >= limit) {
      res.status(403).json({
        success: false,
        error: "Child limit reached for your plan",
        limit,
        current: currentCount,
      });
      return;
    }

    const child = await prisma.child.create({
      data: { ...input, userId },
    });

    res.status(201).json({ success: true, child });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, error: error.errors });
      return;
    }
    console.error("[Children] create error:", error);
    res.status(500).json({ success: false, error: "Failed to create child" });
  }
});

childrenRouter.put("/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: "Token required" });
      return;
    }

    const input = UpdateChildSchema.parse(req.body);

    const existing = await prisma.child.findUnique({ where: { id: req.params.id } });
    if (!existing || existing.userId !== userId) {
      res.status(404).json({ success: false, error: "Child not found" });
      return;
    }

    const child = await prisma.child.update({
      where: { id: req.params.id },
      data: input,
    });

    res.json({ success: true, child });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, error: error.errors });
      return;
    }
    console.error("[Children] update error:", error);
    res.status(500).json({ success: false, error: "Failed to update child" });
  }
});

childrenRouter.delete("/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: "Token required" });
      return;
    }

    const existing = await prisma.child.findUnique({ where: { id: req.params.id } });
    if (!existing || existing.userId !== userId) {
      res.status(404).json({ success: false, error: "Child not found" });
      return;
    }

    await prisma.child.delete({ where: { id: req.params.id } });

    res.json({ success: true, message: "Child deleted" });
  } catch (error) {
    console.error("[Children] delete error:", error);
    res.status(500).json({ success: false, error: "Failed to delete child" });
  }
});
