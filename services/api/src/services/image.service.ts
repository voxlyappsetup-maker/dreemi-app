export interface ImageRequest {
  childName: string;
  childAge: number;
  theme: string;
  storyTitle: string;
  gender?: string;
  skinTone?: string;
  hairColor?: string;
}

export async function generateStoryImage(req: ImageRequest): Promise<string | null> {
  try {
    const prompt = encodeURIComponent(
      `Children book illustration, ${req.childAge} year old ${req.gender || "child"}, ` +
      `${req.theme} adventure, soft watercolor style, cute cartoon, pastel colors, no text`
    );
    const seed = Math.floor(Math.random() * 1000000);
    const url = `https://image.pollinations.ai/prompt/${prompt}?width=1024&height=1024&seed=${seed}&nologo=true`;
    console.log(`[Image] generated via Pollinations for "${req.storyTitle}"`);
    return url;
  } catch (err) {
    console.error("[Image] generation failed:", err);
    return null;
  }
}
