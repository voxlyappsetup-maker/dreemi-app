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

interface AgeImageStyle {
  style: string;
  colors: string;
  characters: string;
  mood: string;
}

function ageImageStyle(age: number): AgeImageStyle {
  if (age <= 3) {
    return {
      style: "very simple bold shapes, minimal background details, 2-3 elements only",
      colors: "bright primary colors, high contrast",
      characters: "very cute chubby cartoon style, large expressive eyes, simple faces",
      mood: "warm, safe, comforting, cheerful",
    };
  }
  if (age <= 5) {
    return {
      style: "simple cartoon illustration, clean lines, not too detailed",
      colors: "bright cheerful colors, pastel accents",
      characters: "cute cartoon characters, friendly expressions",
      mood: "playful, magical, warm",
    };
  }
  if (age <= 7) {
    return {
      style: "children's book illustration style, moderate detail",
      colors: "rich colorful palette, watercolor style",
      characters: "expressive cartoon characters showing emotions",
      mood: "adventurous, exciting, wonder",
    };
  }
  if (age <= 9) {
    return {
      style: "detailed children's book illustration, storybook quality",
      colors: "rich detailed colors, atmospheric lighting",
      characters: "more realistic proportions but still cartoon-like",
      mood: "dramatic, adventurous, emotional depth",
    };
  }
  return {
    style: "detailed illustrated novel style, sophisticated composition",
    colors: "nuanced color palette, mood lighting",
    characters: "semi-realistic characters with emotional complexity",
    mood: "dramatic, thought-provoking, atmospheric",
  };
}

function extractScene(content: string): string {
  return content
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 300);
}

function buildImagePrompt(req: ImageRequest): string {
  const imgStyle = ageImageStyle(req.childAge);

  const scene = req.storyContent
    ? extractScene(req.storyContent)
    : `a magical scene about ${req.theme}`;

  const ageStyleBlock =
    `${imgStyle.style}. Colors: ${imgStyle.colors}. ` +
    `Character style: ${imgStyle.characters}. Mood: ${imgStyle.mood}`;

  return (
    `Children's book illustration: ${scene}. ` +
    `${ageStyleBlock}. ` +
    `No text, no child portrait, focus on the scene and environment. ` +
    `Do NOT show a child's face or portrait. ` +
    `Gentle lighting, classic children's picture book aesthetic.`
  );
}

export async function generateStoryImage(req: ImageRequest): Promise<string | null> {
  try {
    const prompt = encodeURIComponent(buildImagePrompt(req));
    const seed = Math.floor(Math.random() * 1000000);
    const url = `https://image.pollinations.ai/prompt/${prompt}?width=1024&height=1024&seed=${seed}&nologo=true`;
    console.log(`[Image] generated via Pollinations for "${req.storyTitle}"`);
    return url;
  } catch (err) {
    console.error("[Image] generation failed:", err);
    return null;
  }
}
