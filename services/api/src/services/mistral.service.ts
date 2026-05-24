import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";
const MISTRAL_MODEL = "mistral-large-latest";

export interface StoryRequest {
  childName: string;
  childAge: number;
  theme: string;
  moral?: string;
  language: "ar" | "en" | "fr";
}

export interface GeneratedStory {
  title: string;
  content: string;
  moral: string;
}

function buildPrompt(req: StoryRequest): string {
  const prompts: Record<string, string> = {
    ar: `انت كاتب قصص اطفال محترف. اكتب قصة نوم جميلة باللغة العربية الفصحى البسيطة. الاسم: ${req.childName}، العمر: ${req.childAge} سنوات، الموضوع: ${req.theme}${req.moral ? `، القيمة التربوية: ${req.moral}` : ""}. اشترط ان يكون البطل اسمه ${req.childName}، والقصة بين 300 و400 كلمة، مع نهاية سعيدة تبعث على النوم. يجب ان تعيد JSON فقط بهذا الشكل بالضبط بدون اي نص اضافي: {"title": "عنوان القصة", "content": "نص القصة كاملا", "moral": "القيمة المستفادة"}`,
    en: `You are a professional children story writer. Write a beautiful bedtime story in English. Name: ${req.childName}, Age: ${req.childAge}, Theme: ${req.theme}${req.moral ? `, Moral: ${req.moral}` : ""}. The hero must be named ${req.childName}, 300-400 words, happy ending. Return JSON only: {"title": "...", "content": "...", "moral": "..."}`,
    fr: `Vous etes un auteur de contes pour enfants. Ecrivez une belle histoire en francais. Prenom: ${req.childName}, Age: ${req.childAge}, Theme: ${req.theme}${req.moral ? `, Morale: ${req.moral}` : ""}. Le heros doit s appeler ${req.childName}, 300-400 mots, fin heureuse. Retournez JSON uniquement: {"title": "...", "content": "...", "moral": "..."}`
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
      max_tokens: 1500,
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
  return story;
}