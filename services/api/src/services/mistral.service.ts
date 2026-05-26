import dotenv from "dotenv";
try { dotenv.config({ path: "../../.env" }); } catch { /* ignore */ }

const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";
const MISTRAL_MODEL = "mistral-large-latest";

export interface StoryRequest {
  childName: string;
  childAge: number;
  theme: string;
  moral?: string;
  language: "ar" | "en" | "fr";
  duration?: number;
  personality?: string | null;
  hobbies?: string | null;
}

export interface GeneratedStory {
  title: string;
  content: string;
  moral: string;
}

function buildPrompt(req: StoryRequest): string {
  const wordCount = (req.duration ?? 5) * 120;

  let traitAr = "";
  let traitEn = "";
  let traitFr = "";
  if (req.personality) {
    traitAr += `، شخصيته: ${req.personality}`;
    traitEn += `, Personality: ${req.personality}`;
    traitFr += `, Personnalite: ${req.personality}`;
  }
  if (req.hobbies) {
    traitAr += `، هواياته: ${req.hobbies}`;
    traitEn += `, Hobbies: ${req.hobbies}`;
    traitFr += `, Loisirs: ${req.hobbies}`;
  }

  const prompts: Record<string, string> = {
    ar: `انت كاتب قصص اطفال محترف. اكتب قصة نوم جميلة باللغة العربية الفصحى البسيطة. الاسم: ${req.childName}، العمر: ${req.childAge} سنوات، الموضوع: ${req.theme}${req.moral ? `، القيمة التربوية: ${req.moral}` : ""}${traitAr}. اشترط ان يكون البطل اسمه ${req.childName}${req.personality ? ` وان تعكس القصة شخصيته` : ""}${req.hobbies ? ` ويمارس هواياته في القصة` : ""}، يجب ان تكون القصة ${wordCount} كلمة تقريبا، مع نهاية سعيدة تبعث على النوم. يجب ان تعيد JSON فقط بهذا الشكل بالضبط بدون اي نص اضافي: {"title": "عنوان القصة", "content": "نص القصة كاملا", "moral": "القيمة المستفادة"}`,
    en: `You are a professional children story writer. Write a beautiful bedtime story in English. Name: ${req.childName}, Age: ${req.childAge}, Theme: ${req.theme}${req.moral ? `, Moral: ${req.moral}` : ""}${traitEn}. The hero must be named ${req.childName}${req.personality ? `. The story should reflect the child's ${req.personality} personality` : ""}${req.hobbies ? `. Weave the child's hobbies (${req.hobbies}) into the story naturally` : ""}. The story must be approximately ${wordCount} words long. Happy ending. Separate each paragraph with a blank line (double newline \\n\\n). Return JSON only: {"title": "...", "content": "full story text with \\n\\n between paragraphs", "moral": "..."}`,
    fr: `Vous etes un auteur de contes pour enfants. Ecrivez une belle histoire en francais. Prenom: ${req.childName}, Age: ${req.childAge}, Theme: ${req.theme}${req.moral ? `, Morale: ${req.moral}` : ""}${traitFr}. Le heros doit s appeler ${req.childName}${req.personality ? `. L histoire doit refleter la personnalite ${req.personality} de l enfant` : ""}${req.hobbies ? `. Integrez naturellement les loisirs de l enfant (${req.hobbies}) dans l histoire` : ""}. L histoire doit faire environ ${wordCount} mots. Fin heureuse. Separez chaque paragraphe par une ligne vide (double retour a la ligne \\n\\n). Retournez JSON uniquement: {"title": "...", "content": "texte complet avec \\n\\n entre les paragraphes", "moral": "..."}`
  };
  return prompts[req.language] || prompts.ar;
}

export async function generateStoryWithMistral(req: StoryRequest): Promise<GeneratedStory> {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) throw new Error("MISTRAL_API_KEY غير موجود");

  const response = await fetch(MISTRAL_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: MISTRAL_MODEL,
      temperature: 0.9,
      max_tokens: Math.max(1500, ((req.duration ?? 5) * 120 * 2)),
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: buildPrompt(req) }],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Mistral error: ${response.status} - ${errText}`);
  }

  const data = await response.json() as { choices: Array<{ message: { content: string } }> };
  const raw  = data.choices[0].message.content;

  console.log("[Mistral] raw:", raw.substring(0, 150));

  const story = JSON.parse(raw) as GeneratedStory;

  if (!story.title || !story.content) throw new Error("القصة غير مكتملة");

  // Normalize paragraph breaks: some models return single \n between paragraphs
  story.content = story.content
    .replace(/\r\n/g, "\n")
    .replace(/(?<!\n)\n(?!\n)/g, "\n\n");

  return story;
}