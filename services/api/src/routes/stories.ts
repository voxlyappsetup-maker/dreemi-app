import { Router, Request, Response } from "express";
import { z } from "zod";
import { generateStoryWithMistral } from "../services/mistral.service";
import { prisma } from "../services/prisma.service";
import { authenticateToken } from "../middleware/auth.middleware";

export const storiesRouter = Router();

const GenerateSchema = z.object({
  childName: z.string().min(1).max(50),
  childAge:  z.number().int().min(2).max(12),
  theme:     z.string().min(1).max(100),
  moral:     z.string().max(100).optional(),
  language:  z.enum(["ar", "en", "fr"]).default("ar"),
  childId:   z.string().optional(),
});

storiesRouter.get("/", async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    if (!userId || typeof userId !== "string") {
      res.status(400).json({ success: false, error: "userId مطلوب" });
      return;
    }
    const stories = await prisma.story.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    res.json({ success: true, stories });
  } catch (error) {
    res.status(500).json({ success: false, error: "خطأ في جلب القصص" });
  }
});

storiesRouter.post("/generate", authenticateToken, async (req: Request, res: Response) => {
  try {
    const input = GenerateSchema.parse(req.body);
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: "رمز الوصول مطلوب" });
      return;
    }
    console.log(`[Stories] توليد قصة لـ ${input.childName} (${input.language})`);
    const generated = await generateStoryWithMistral(input);
    const story = await prisma.story.create({
      data: {
        title:     generated.title,
        content:   generated.content,
        moral:     generated.moral,
        theme:     input.theme,
        language:  input.language,
        childName: input.childName,
        childAge:  input.childAge,
        userId,
        childId:   input.childId,
      },
    });
    console.log(`[Stories] تم حفظ القصة: ${story.id}`);
    res.status(201).json({ success: true, story });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, error: error.errors });
      return;
    }
    console.error("[Stories] خطأ:", error);
    res.status(500).json({ success: false, error: "فشل توليد القصة" });
  }
});

storiesRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const story = await prisma.story.findUnique({ where: { id: req.params.id } });
    if (!story) {
      res.status(404).json({ success: false, error: "القصة غير موجودة" });
      return;
    }
    res.json({ success: true, story });
  } catch (error) {
    res.status(500).json({ success: false, error: "خطأ في جلب القصة" });
  }
});