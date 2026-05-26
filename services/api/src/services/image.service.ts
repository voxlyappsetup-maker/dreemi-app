export interface ImageRequest {
  childName: string;
  childAge: number;
  theme: string;
  storyTitle: string;
  storyContent?: string;
  gender?: string;
  skinTone?: string;
  hairColor?: string;
  personality?: string | null;
  favAnimal?: string | null;
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

function extractScene(content: string): string {
  const cleaned = content
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const snippet = cleaned.slice(0, 200).trimEnd();
  const lastDot = snippet.lastIndexOf(".");
  return lastDot > 60 ? snippet.slice(0, lastDot + 1) : snippet + "...";
}

export async function generateStoryImage(req: ImageRequest): Promise<string | null> {
  try {
    const genderDesc = GENDER_MAP[req.gender ?? "boy"] ?? "young child";
    const skinDesc = SKIN_MAP[req.skinTone ?? "medium"] ?? "olive skin";
    const hairDesc = HAIR_MAP[req.hairColor ?? "black"] ?? "black hair";
    const character = `${genderDesc} with ${skinDesc} and ${hairDesc} named ${req.childName}`;

    let scene: string;
    if (req.storyContent) {
      scene = extractScene(req.storyContent);
    } else {
      scene = `a magical scene about ${req.theme}`;
    }

    const animalPart = req.favAnimal ? ` with their favorite ${req.favAnimal} companion` : "";
    const personalityPart = req.personality ? `, looking ${req.personality}` : "";

    const prompt = encodeURIComponent(
      `Children's book watercolor illustration, no text in image: ${scene}. ` +
      `A ${req.childAge}-year-old ${character}${personalityPart} as the main character${animalPart}. ` +
      `Soft pastel colors, cute cartoon style, gentle lighting, classic children's picture book aesthetic.`
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
