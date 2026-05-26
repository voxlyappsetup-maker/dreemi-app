import { Router, Request, Response } from "express";
import { z } from "zod";
import { generateStoryWithMistral } from "../services/mistral.service";
import { generateStoryImage } from "../services/image.service";
import { prisma } from "../services/prisma.service";
import { authenticateToken } from "../middleware/auth.middleware";
import { checkStoryLimit } from "../middleware/plans.middleware";

export const storiesRouter = Router();

const GenerateSchema = z.object({
  childName: z.string().min(1).max(50).optional(),
  childAge:  z.number().int().min(2).max(12).optional(),
  theme:     z.string().min(1).max(100),
  moral:     z.string().max(100).optional(),
  language:  z.enum(["ar", "en", "fr"]).default("ar"),
  duration:  z.number().int().min(3).max(15).default(5),
  gender:    z.enum(["boy", "girl"]).default("boy"),
  skinTone:  z.enum(["light", "medium", "dark"]).default("medium"),
  hairColor: z.enum(["black", "brown", "blonde", "red"]).default("black"),
  childId:   z.string().optional(),
}).refine(
  (data) => data.childId || (data.childName && data.childAge !== undefined),
  { message: "Either childId or both childName and childAge are required" },
);

storiesRouter.get("/", async (req: Request, res: Response) => {
  try {
    const { userId, childId } = req.query;
    if (!userId || typeof userId !== "string") {
      res.status(400).json({ success: false, error: "userId required" });
      return;
    }
    const where: { userId: string; childId?: string } = { userId };
    if (childId && typeof childId === "string") {
      where.childId = childId;
    }
    const stories = await prisma.story.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    res.json({ success: true, stories });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch stories" });
  }
});

storiesRouter.post("/generate", authenticateToken, checkStoryLimit, async (req: Request, res: Response) => {
  try {
    const input = GenerateSchema.parse(req.body);
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: "Token required" });
      return;
    }

    let childName = input.childName ?? "";
    let childAge = input.childAge ?? 5;
    let gender = input.gender;
    let skinTone = input.skinTone;
    let hairColor = input.hairColor;
    let childId = input.childId;
    let personality: string | null = null;
    let hobbies: string | null = null;
    let favAnimal: string | null = null;

    if (childId) {
      const child = await prisma.child.findUnique({ where: { id: childId } });
      if (!child || child.userId !== userId) {
        res.status(404).json({ success: false, error: "Child not found" });
        return;
      }
      childName = child.name;
      childAge = child.age;
      gender = (child.gender as "boy" | "girl") || gender;
      skinTone = (child.skinTone as "light" | "medium" | "dark") || skinTone;
      hairColor = (child.hairColor as "black" | "brown" | "blonde" | "red") || hairColor;
      personality = child.personality;
      hobbies = child.hobbies;
      favAnimal = child.favAnimal;
    }

    const storyInput = { ...input, childName, childAge, gender, skinTone, hairColor, personality, hobbies };

    const generated = await generateStoryWithMistral(storyInput);

    const story = await prisma.story.create({
      data: {
        title:     generated.title,
        content:   generated.content,
        moral:     generated.moral,
        theme:     input.theme,
        language:  input.language,
        childName,
        childAge,
        imageUrl:  null,
        userId,
        childId,
      },
    });

    res.status(201).json({ success: true, story });

    generateStoryImage({
      childName,
      childAge,
      theme:        input.theme,
      storyTitle:   generated.title,
      storyContent: generated.content,
      gender,
      skinTone,
      hairColor,
      personality,
      favAnimal,
    }).then(async (imageUrl) => {
      if (imageUrl) {
        await prisma.story.update({
          where: { id: story.id },
          data:  { imageUrl },
        });
        console.log("[Stories] image ready:", story.id);
      }
    }).catch((err) => {
      console.error("[Stories] image failed:", err?.message);
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, error: error.errors });
      return;
    }
    console.error("[Stories] error:", error);
    res.status(500).json({ success: false, error: "Failed to generate story" });
  }
});

storiesRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const story = await prisma.story.findUnique({ where: { id: req.params.id } });
    if (!story) {
      res.status(404).json({ success: false, error: "Story not found" });
      return;
    }
    res.json({ success: true, story });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch story" });
  }
});
