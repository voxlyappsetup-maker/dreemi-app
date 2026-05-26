export interface ImageRequest {
  childName: string;
  childAge: number;
  theme: string;
  storyTitle: string;
  gender?: string;
  skinTone?: string;
  hairColor?: string;
}

const GENDER_MAP: Record<string, string> = {
  boy: "young boy",
  girl: "young girl",
};

const SKIN_MAP: Record<string, string> = {
  light: "fair skin",
  medium: "olive skin",
  dark: "dark brown skin",
};

const HAIR_MAP: Record<string, string> = {
  black: "black hair",
  brown: "brown hair",
  blonde: "golden blonde hair",
  red: "red hair",
};

export async function generateStoryImage(req: ImageRequest): Promise<string | null> {
  try {
    const genderDesc = GENDER_MAP[req.gender ?? "boy"] ?? "young child";
    const skinDesc = SKIN_MAP[req.skinTone ?? "medium"] ?? "olive skin";
    const hairDesc = HAIR_MAP[req.hairColor ?? "black"] ?? "black hair";

    const prompt = encodeURIComponent(
      `Children's book watercolor illustration, soft pastel colors, cute cartoon style, whimsical and dreamy atmosphere, no text in image. ` +
      `A ${req.childAge}-year-old ${genderDesc} with ${skinDesc} and ${hairDesc} named ${req.childName}, ` +
      `in a magical scene about ${req.theme}. ` +
      `Gentle lighting, classic children's picture book aesthetic.`
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
