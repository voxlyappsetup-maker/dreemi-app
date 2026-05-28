import { Router, Request, Response } from "express";
import { z } from "zod";
import rateLimit from "express-rate-limit";
import { generateStoryWithMistral } from "../services/mistral.service";
import { generateStoryImage } from "../services/image.service";
import { prisma } from "../services/prisma.service";
import { authenticateToken } from "../middleware/auth.middleware";
import { checkStoryLimit } from "../middleware/plans.middleware";
import { checkSafety } from "../services/safety.service";

export const storiesRouter = Router();

const GenerateSchema = z.object({
  childName: z.string().min(1).max(50).optional(),
  childAge:  z.number().int().min(2).max(12).optional(),
  theme:     z.string().min(1).max(100),
  moral:     z.string().max(100).optional(),
  language:  z.enum(["ar", "en", "fr"]).default("ar"),
  duration:  z.number().int().min(3).max(10).default(5),
  gender:    z.enum(["boy", "girl"]).default("boy"),
  skinTone:  z.enum(["light", "medium", "dark"]).default("medium"),
  hairColor: z.enum(["black", "brown", "blonde", "red"]).default("black"),
  childId:   z.string().optional(),
}).refine(
  (data) => data.childId || (data.childName && data.childAge !== undefined),
  { message: "Either childId or both childName and childAge are required" },
);

/**
 * Narrow rate-limiter scoped only to the generate endpoint.
 * 10 story generations per IP per 15 minutes is generous for beta users
 * while blocking automated abuse.  Returns a stable JSON error body.
 */
const generateRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "RATE_LIMIT_EXCEEDED",
    message: "Too many story generation requests. Please wait a few minutes and try again.",
  },
  skipSuccessfulRequests: false,
});

// ── GET /api/stories ─────────────────────────────────────────────────────────
// Requires authentication. userId is taken from the verified JWT, never from
// the query string.  If childId is supplied, it is verified to belong to the
// authenticated user before filtering; otherwise an empty list is returned
// silently to avoid leaking child-ownership information.
storiesRouter.get("/", authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const { childId } = req.query;

    if (childId && typeof childId === "string") {
      const child = await prisma.child.findUnique({ where: { id: childId } });
      if (!child || child.userId !== userId) {
        // Return an empty list — do not reveal whether the child exists at all.
        res.json({ success: true, stories: [] });
        return;
      }
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
  } catch {
    res.status(500).json({ success: false, error: "Failed to fetch stories" });
  }
});

// ── POST /api/stories/generate ────────────────────────────────────────────────
storiesRouter.post(
  "/generate",
  authenticateToken,
  generateRateLimit,
  checkStoryLimit,
  async (req: Request, res: Response) => {
    try {
      const input = GenerateSchema.parse(req.body);
      const userId = req.userId!;

      // ── Safety gate: check user-supplied inputs before calling Mistral ───────
      const inputText = [input.theme, input.moral].filter(Boolean).join(" ");
      const inputCheck = checkSafety(inputText);
      if (!inputCheck.safe) {
        res.status(400).json({
          success: false,
          error: "UNSAFE_INPUT",
          message: "This theme or moral is not appropriate for a children's story. Please choose a different topic.",
        });
        return;
      }

      let childName = input.childName ?? "";
      let childAge  = input.childAge  ?? 5;
      let gender    = input.gender;
      let skinTone  = input.skinTone;
      let hairColor = input.hairColor;
      let childId   = input.childId;
      let personality: string | null = null;
      let hobbies:     string | null = null;
      let favAnimal:   string | null = null;

      if (childId) {
        const child = await prisma.child.findUnique({ where: { id: childId } });
        if (!child || child.userId !== userId) {
          res.status(404).json({ success: false, error: "Child not found" });
          return;
        }
        childName = child.name;
        childAge  = child.age;
        gender    = (child.gender    as "boy" | "girl")                    || gender;
        skinTone  = (child.skinTone  as "light" | "medium" | "dark")      || skinTone;
        hairColor = (child.hairColor as "black" | "brown" | "blonde" | "red") || hairColor;
        personality = child.personality;
        hobbies     = child.hobbies;
        favAnimal   = child.favAnimal;
      }

      const storyInput = { ...input, childName, childAge, gender, skinTone, hairColor, personality, hobbies };

      const generated = await generateStoryWithMistral(storyInput);

      // ── Safety gate: check generated output before persisting ───────────────
      const outputText = [generated.title, generated.content, generated.moral].filter(Boolean).join(" ");
      const outputCheck = checkSafety(outputText);
      if (!outputCheck.safe) {
        console.error("[Stories] safety gate blocked generated content, category:", outputCheck.category);
        res.status(422).json({
          success: false,
          error: "GENERATION_FAILED",
          message: "Story generation did not meet safety standards. Please try a different theme.",
        });
        return;
      }

      const story = await prisma.story.create({
        data: {
          title:    generated.title,
          content:  generated.content,
          moral:    generated.moral,
          theme:    input.theme,
          language: input.language,
          childName,
          childAge,
          imageUrl: null,
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
      }).catch((err: unknown) => {
        console.error("[Stories] image failed:", (err as Error)?.message);
      });

    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, error: error.errors });
        return;
      }
      console.error("[Stories] generate error:", (error as Error)?.message ?? error);
      res.status(500).json({ success: false, error: "Failed to generate story" });
    }
  },
);

// ── GET /api/stories/:id ─────────────────────────────────────────────────────
// Requires authentication. Only the owner can read their own story.
// Returns 404 for both missing stories and stories owned by someone else —
// this prevents clients from probing whether a given story ID exists.
// NOTE: Public share links are intentionally disabled in this phase.
// A safe share-token design (short-lived signed tokens) will be added later.
storiesRouter.get("/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const story = await prisma.story.findUnique({ where: { id: req.params.id } });
    if (!story || story.userId !== userId) {
      res.status(404).json({ success: false, error: "Story not found" });
      return;
    }
    res.json({ success: true, story });
  } catch {
    res.status(500).json({ success: false, error: "Failed to fetch story" });
  }
});

// ── DELETE /api/stories/:id ───────────────────────────────────────────────────
// Unchanged: requires auth, owner-only, 403 on wrong owner.
storiesRouter.delete("/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;

    const story = await prisma.story.findUnique({ where: { id: req.params.id } });
    if (!story) {
      res.status(404).json({ success: false, error: "Story not found" });
      return;
    }
    if (story.userId !== userId) {
      res.status(403).json({ success: false, error: "Forbidden" });
      return;
    }

    await prisma.story.delete({ where: { id: req.params.id } });

    res.json({ success: true, message: "Story deleted" });
  } catch (error) {
    console.error("[Stories] delete error:", (error as Error)?.message ?? error);
    res.status(500).json({ success: false, error: "Failed to delete story" });
  }
});
