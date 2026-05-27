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

interface AgeProfile {
  level: string;
  sentences: string;
  vocabulary: string;
  concepts: string;
  length: string;
  style: string;
}

function ageProfile(age: number): AgeProfile {
  if (age <= 3) {
    return {
      level: "toddler",
      sentences: "very short sentences (5-7 words max)",
      vocabulary: "simple everyday words only, no complex concepts",
      concepts: "basic emotions, animals, colors, family",
      length: "very short story (200-300 words)",
      style: "repetitive patterns, simple rhymes, cause and effect",
    };
  }
  if (age <= 5) {
    return {
      level: "preschool",
      sentences: "short simple sentences (8-10 words)",
      vocabulary: "simple words, introduce 1-2 new words with context",
      concepts: "friendship, sharing, basic problem solving",
      length: "short story (300-500 words)",
      style: "clear narrative, relatable characters, simple moral",
    };
  }
  if (age <= 7) {
    return {
      level: "early reader",
      sentences: "medium sentences with simple conjunctions",
      vocabulary: "expanding vocabulary, emotions, descriptive words",
      concepts: "courage, honesty, teamwork, overcoming fears",
      length: "medium story (500-700 words)",
      style: "beginning-middle-end structure, dialogue, suspense",
    };
  }
  if (age <= 9) {
    return {
      level: "middle childhood",
      sentences: "varied sentence structure",
      vocabulary: "richer vocabulary, figurative language",
      concepts: "justice, loyalty, self-discovery, complex emotions",
      length: "longer story (700-900 words)",
      style: "plot twists, character development, meaningful moral",
    };
  }
  return {
    level: "preteen",
    sentences: "complex sentences, varied structure",
    vocabulary: "advanced vocabulary, metaphors, idioms",
    concepts: "identity, responsibility, empathy, moral dilemmas",
    length: "full story (900-1200 words)",
    style: "nuanced characters, subplots, deeper themes",
  };
}

const WORDS_PER_MINUTE: Record<StoryRequest["language"], number> = {
  ar: 145,
  fr: 150,
  en: 160,
};

const PARAGRAPH_RULE: Record<StoryRequest["language"], string> = {
  ar: `قسّم القصة إلى فقرات واضحة. كل فقرة من 3-5 جمل. استخدم دائماً سطراً فارغاً بين الفقرات (\\n\\n في حقل content).`,
  en: `Divide the story into clear paragraphs. Each paragraph should be 3-5 sentences. Always use line breaks between paragraphs (\\n\\n in the content field).`,
  fr: `Divisez l'histoire en paragraphes clairs. Chaque paragraphe doit contenir 3-5 phrases. Utilisez toujours des sauts de ligne entre les paragraphes (\\n\\n dans le champ content).`,
};

function minWordsByAge(age: number): number {
  if (age <= 3) return 250;
  if (age <= 5) return 400;
  if (age <= 7) return 600;
  if (age <= 9) return 800;
  return 900;
}

function targetWordCount(
  age: number,
  language: StoryRequest["language"],
  duration?: number,
): number {
  const mins = duration ?? 5;
  const targetByDuration = mins * WORDS_PER_MINUTE[language];
  const minWords = minWordsByAge(age);
  return Math.min(Math.max(targetByDuration, minWords), 1300);
}

function buildAgeProfileBlock(req: StoryRequest, profile: AgeProfile, wordCount: number): string {
  const blocks: Record<string, string> = {
    ar: `
ملف العمر الإلزامي (الطفل ${req.childAge} سنوات — المستوى: ${profile.level}):
يجب الالتزام الصارم بهذا الملف عند الكتابة:
- الجمل: ${profile.sentences}
- المفردات واللغة: ${profile.vocabulary}
- المفاهيم والمواضيع المسموحة: ${profile.concepts}
- طول القصة: ${profile.length} (حوالي ${wordCount} كلمة)
- أسلوب السرد: ${profile.style}
ممنوع استخدام لغة أو مفاهيم أو تعقيد أعلى من مستوى عمر الطفل.
اكتب قصة كاملة غير منقوصة: بداية ووسط ونهاية واضحة. لا تختصر ولا تلخص — حقل content يجب أن يحتوي النص الكامل بحوالي ${wordCount} كلمة.
${PARAGRAPH_RULE.ar}`,
    en: `
MANDATORY AGE PROFILE (child is ${req.childAge} years old — level: ${profile.level}):
You MUST strictly follow this profile:
- Sentences: ${profile.sentences}
- Vocabulary & language level: ${profile.vocabulary}
- Allowed concepts & themes: ${profile.concepts}
- Story length: ${profile.length} (approximately ${wordCount} words)
- Narrative style: ${profile.style}
Do NOT use language, concepts, or complexity above this child's age level.
Write a COMPLETE, non-truncated story with a clear beginning, middle, and end. Do NOT summarize or cut short — the content field must contain the full story of approximately ${wordCount} words.
${PARAGRAPH_RULE.en}`,
    fr: `
PROFIL D AGE OBLIGATOIRE (enfant de ${req.childAge} ans — niveau: ${profile.level}):
Vous DEVEZ respecter strictement ce profil:
- Phrases: ${profile.sentences}
- Vocabulaire et niveau de langue: ${profile.vocabulary}
- Concepts et themes autorises: ${profile.concepts}
- Longueur: ${profile.length} (environ ${wordCount} mots)
- Style narratif: ${profile.style}
N utilisez pas un langage, des concepts ou une complexite au-dessus de l age de l enfant.
Ecrivez une histoire COMPLETE et non tronquee: debut, milieu et fin clairs. Ne resumez pas — le champ content doit contenir le texte integral d environ ${wordCount} mots.
${PARAGRAPH_RULE.fr}`,
  };
  return blocks[req.language] || blocks.en;
}

function buildPrompt(req: StoryRequest): string {
  const profile = ageProfile(req.childAge);
  const wordCount = targetWordCount(req.childAge, req.language, req.duration);
  const ageBlock = buildAgeProfileBlock(req, profile, wordCount);

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
    ar: `انت كاتب قصص اطفال محترف. اكتب قصة نوم جميلة باللغة العربية الفصحى البسيطة.
${ageBlock}
${PARAGRAPH_RULE.ar}
الاسم: ${req.childName}، العمر: ${req.childAge} سنوات، الموضوع: ${req.theme}${req.moral ? `، القيمة التربوية: ${req.moral}` : ""}${traitAr}. اشترط ان يكون البطل اسمه ${req.childName}${req.personality ? ` وان تعكس القصة شخصيته` : ""}${req.hobbies ? ` ويمارس هواياته في القصة` : ""}، يجب ان تكون القصة كاملة بحوالي ${wordCount} كلمة (لا تقصّرها)، مع نهاية سعيدة تبعث على النوم. يجب ان تعيد JSON فقط بهذا الشكل بالضبط بدون اي نص اضافي: {"title": "عنوان القصة", "content": "نص القصة كاملا", "moral": "القيمة المستفادة"}`,
    en: `You are a professional children's story writer. Write a beautiful bedtime story in English.
${ageBlock}
${PARAGRAPH_RULE.en}
Name: ${req.childName}, Age: ${req.childAge}, Theme: ${req.theme}${req.moral ? `, Moral: ${req.moral}` : ""}${traitEn}. The hero must be named ${req.childName}${req.personality ? `. The story should reflect the child's ${req.personality} personality` : ""}${req.hobbies ? `. Weave the child's hobbies (${req.hobbies}) into the story naturally` : ""}. The story must be a complete, full-length narrative of approximately ${wordCount} words — do not truncate. Happy ending. Return JSON only: {"title": "...", "content": "full story text with \\n\\n between paragraphs", "moral": "..."}`,
    fr: `Vous etes un auteur de contes pour enfants. Ecrivez une belle histoire du soir en francais.
${ageBlock}
${PARAGRAPH_RULE.fr}
Prenom: ${req.childName}, Age: ${req.childAge}, Theme: ${req.theme}${req.moral ? `, Morale: ${req.moral}` : ""}${traitFr}. Le heros doit s appeler ${req.childName}${req.personality ? `. L histoire doit refleter la personnalite ${req.personality} de l enfant` : ""}${req.hobbies ? `. Integrez naturellement les loisirs de l enfant (${req.hobbies}) dans l histoire` : ""}. L histoire doit etre complete et faire environ ${wordCount} mots — sans troncature. Fin heureuse. Retournez JSON uniquement: {"title": "...", "content": "texte complet avec \\n\\n entre les paragraphes", "moral": "..."}`
  };
  return prompts[req.language] || prompts.ar;
}

export async function generateStoryWithMistral(req: StoryRequest): Promise<GeneratedStory> {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) throw new Error("MISTRAL_API_KEY is not set");

  const wordCount = targetWordCount(req.childAge, req.language, req.duration);

  const response = await fetch(MISTRAL_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: MISTRAL_MODEL,
      temperature: 0.9,
      max_tokens: Math.max(2000, wordCount * 2),
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

  if (!story.title || !story.content) throw new Error("Story generation incomplete");

  // Normalize paragraph breaks: some models return single \n between paragraphs
  story.content = story.content
    .replace(/\r\n/g, "\n")
    .replace(/(?<!\n)\n(?!\n)/g, "\n\n");

  return story;
}
