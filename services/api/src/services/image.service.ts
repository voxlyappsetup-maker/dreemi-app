import OpenAI from "openai";

export interface ImageRequest {
  childName: string;
  childAge: number;
  theme: string;
  storyTitle: string;
  gender?: string;
  skinTone?: string;
  hairColor?: string;
}

function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

export async function generateStoryImage(req: ImageRequest): Promise<string | null> {
  const openai = getOpenAIClient();
  if (!openai) {
    console.log("[Image] OPENAI_API_KEY not set, skipping image generation");
    return null;
  }

  const gender = req.gender || "boy";
  const skinTone = req.skinTone || "medium";
  const hairColor = req.hairColor || "black";

  const prompt = [
    "Children's book watercolor illustration, soft warm colors, cartoon style, cute and friendly, no text in image.",
    `A ${req.childAge}-year-old ${gender} with ${skinTone} skin and ${hairColor} hair`,
    `named ${req.childName}, in a magical scene about ${req.theme}.`,
    "Style: classic children's picture book, pastel colors, gentle lighting, whimsical and dreamy atmosphere.",
  ].join(" ");

  try {
    const response = await openai.images.generate({
      model: "dall-e-2",
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    const url = response.data?.[0]?.url ?? null;
    console.log(`[Image] âœ“ generated for "${req.storyTitle}": ${url ? "ok" : "no url"}`);
    return url;
  } catch (err) {
    console.error("[Image] generation failed:", err);
    return null;
  }
}

