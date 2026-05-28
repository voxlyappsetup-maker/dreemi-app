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
  ar: `قسّم القصة إلى فقرات طبيعية قصيرة. عادةً 2-3 جمل قصيرة في كل فقرة. لا تجعل كل جملة فقرة وحدها. افصل بين الفقرات بسطر فارغ (\\n\\n). لا تكتب القصة كنص متواصل غير مقسّم.`,
  en: `Divide the story into short, natural paragraphs separated by blank lines (\\n\\n). Each paragraph should contain 3-4 sentences. Do NOT put each sentence on its own line. Do NOT write the story as one continuous block of text.`,
  fr: `Divisez l'histoire en paragraphes naturels et courts separes par des lignes vides (\\n\\n). Chaque paragraphe doit contenir 3-4 phrases. Ne mettez PAS chaque phrase sur sa propre ligne. N'ecrivez PAS l'histoire en un seul bloc continu.`,
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
الاسم: ${req.childName}، العمر: ${req.childAge} سنوات، الموضوع: ${req.theme}${req.moral ? `، القيمة التربوية: ${req.moral}` : ""}${traitAr}. اشترط ان يكون البطل اسمه ${req.childName}${req.personality ? ` وان تعكس القصة شخصيته` : ""}${req.hobbies ? ` ويمارس هواياته في القصة` : ""}، يجب ان تكون القصة كاملة بحوالي ${wordCount} كلمة (لا تقصّرها)، مع نهاية سعيدة تبعث على النوم. يجب ان تعيد JSON فقط بهذا الشكل بالضبط بدون اي نص اضافي: {"title": "عنوان القصة", "content": "نص القصة كاملا", "moral": "القيمة المستفادة"}`,
    en: `You are a professional children's story writer. Write a beautiful bedtime story in English.
${ageBlock}
Name: ${req.childName}, Age: ${req.childAge}, Theme: ${req.theme}${req.moral ? `, Moral: ${req.moral}` : ""}${traitEn}. The hero must be named ${req.childName}${req.personality ? `. The story should reflect the child's ${req.personality} personality` : ""}${req.hobbies ? `. Weave the child's hobbies (${req.hobbies}) into the story naturally` : ""}. The story must be a complete, full-length narrative of approximately ${wordCount} words — do not truncate. Happy ending. Return JSON only: {"title": "...", "content": "full story text with \\n\\n between paragraphs", "moral": "..."}`,
    fr: `Vous etes un auteur de contes pour enfants. Ecrivez une belle histoire du soir en francais.
${ageBlock}
Prenom: ${req.childName}, Age: ${req.childAge}, Theme: ${req.theme}${req.moral ? `, Morale: ${req.moral}` : ""}${traitFr}. Le heros doit s appeler ${req.childName}${req.personality ? `. L histoire doit refleter la personnalite ${req.personality} de l enfant` : ""}${req.hobbies ? `. Integrez naturellement les loisirs de l enfant (${req.hobbies}) dans l histoire` : ""}. L histoire doit etre complete et faire environ ${wordCount} mots — sans troncature. Fin heureuse. Retournez JSON uniquement: {"title": "...", "content": "texte complet avec \\n\\n entre les paragraphes", "moral": "..."}`
  };
  return prompts[req.language] || prompts.ar;
}

// ── Token estimation ─────────────────────────────────────────────────────────

/**
 * Estimates the max_tokens value to request from Mistral.
 *
 * Arabic text uses significantly more tokens per word than Latin scripts
 * because Arabic Unicode codepoints typically encode as multiple BPE tokens.
 * A conservative multiplier of 4 is used for Arabic; 2 for English/French.
 * Both are capped at 4096 to avoid runaway costs and stay within model limits.
 */
export function estimateMaxTokens(
  language: StoryRequest["language"],
  wordCount: number,
): number {
  if (language === "ar") {
    return Math.min(4096, Math.max(2500, wordCount * 4));
  }
  return Math.min(4096, Math.max(2000, wordCount * 2));
}

// ── JSON parsing ─────────────────────────────────────────────────────────────

/**
 * Parses and validates the raw string returned by Mistral into a GeneratedStory.
 *
 * Tolerates:
 *   - Leading/trailing whitespace
 *   - Fenced code blocks (```json ... ``` or ``` ... ```)
 *
 * Validates:
 *   - title is a non-empty string
 *   - content is a non-empty string
 *   - moral, if present, is coerced to a string; if absent defaults to ""
 *
 * Throws "Mistral returned invalid JSON" on any parse or validation failure.
 * Never logs or surfaces the raw content in the error message.
 */
export function parseGeneratedStoryJson(raw: string): GeneratedStory {
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("Mistral returned invalid JSON");
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Mistral returned invalid JSON");
  }

  const obj = parsed as Record<string, unknown>;

  if (typeof obj.title !== "string" || !obj.title.trim()) {
    throw new Error("Mistral returned invalid JSON");
  }
  if (typeof obj.content !== "string" || !obj.content.trim()) {
    throw new Error("Mistral returned invalid JSON");
  }

  return {
    title:   obj.title.trim(),
    content: (obj.content as string).trim(),
    moral:   typeof obj.moral === "string" ? obj.moral.trim() : "",
  };
}

// ── Content normalisation ────────────────────────────────────────────────────

/**
 * Splits `text` into individual sentences by locating sentence-ending
 * punctuation (. ! ? ؟ ۔) followed by whitespace or end of string.
 * The punctuation is kept attached to its sentence.
 * Any unpunctuated trailing fragment is returned as the last element.
 *
 * Arabic commas (،) are intentionally excluded — they are clause separators,
 * not sentence endings, and splitting on them fragments Arabic prose unnaturally.
 */
function extractSentences(text: string): string[] {
  const re = /([.!?؟۔][)'"»]*)\s+(?=\S)/g;
  const result: string[] = [];
  let lastEnd = 0;
  let m: RegExpExecArray | null;

  while ((m = re.exec(text)) !== null) {
    const sentence = text.slice(lastEnd, m.index + m[1].length).trim();
    if (sentence) result.push(sentence);
    lastEnd = m.index + m[0].length;
  }

  const tail = text.slice(lastEnd).trim();
  if (tail) result.push(tail);

  return result;
}

/**
 * Splits very long text by word boundary when sentence grouping cannot reduce
 * size (for example an unpunctuated block or one sentence longer than limit).
 *
 * Split preference:
 *   1. Last whitespace at/near the limit (only if beyond 40% of charLimit).
 *   2. Hard cut at charLimit when no suitable whitespace exists.
 *
 * Text order is preserved. No words are dropped.
 */
function splitLongTextByWordBoundary(text: string, charLimit: number): string[] {
  if (text.length <= charLimit) return [text];

  const chunks: string[] = [];
  let remaining = text;

  while (remaining.length > charLimit) {
    const slice = remaining.slice(0, charLimit);
    const lastWhitespace = Math.max(
      slice.lastIndexOf(" "),
      slice.lastIndexOf("\t"),
      slice.lastIndexOf("\n"),
    );

    if (lastWhitespace > Math.floor(charLimit * 0.4)) {
      chunks.push(remaining.slice(0, lastWhitespace).trimEnd());
      remaining = remaining.slice(lastWhitespace).trimStart();
    } else {
      chunks.push(remaining.slice(0, charLimit));
      remaining = remaining.slice(charLimit);
    }
  }

  if (remaining.trim().length > 0) {
    chunks.push(remaining.trim());
  }

  return chunks;
}

/**
 * Groups an array of sentences into natural paragraphs.
 * Each group contains at most `groupSize` sentences, and the joined text
 * stays under `charLimit`. If one sentence exceeds `charLimit`, it is split
 * by word boundary as a fallback.
 */
function groupSentencesIntoParagraphs(
  sentences: string[],
  groupSize: number,
  charLimit: number,
): string[] {
  const paragraphs: string[] = [];
  let group: string[] = [];
  let groupLen = 0;

  for (const sentence of sentences) {
    if (sentence.length > charLimit) {
      if (group.length > 0) {
        paragraphs.push(group.join(" "));
        group = [];
        groupLen = 0;
      }
      paragraphs.push(...splitLongTextByWordBoundary(sentence, charLimit));
      continue;
    }

    const nextLen = groupLen > 0 ? groupLen + 1 + sentence.length : sentence.length;
    const groupFull  = group.length >= groupSize;
    const wouldExceedLimit = group.length > 0 && nextLen > charLimit;

    if (groupFull || wouldExceedLimit) {
      paragraphs.push(group.join(" "));
      group = [sentence];
      groupLen = sentence.length;
    } else {
      group.push(sentence);
      groupLen = nextLen;
    }
  }

  if (group.length > 0) paragraphs.push(group.join(" "));

  return paragraphs;
}

/**
 * Normalises raw story content returned by the LLM before it is saved.
 *
 * Algorithm (in order):
 *   1. Normalize CRLF and bare CR to LF.
 *   2. Split on double+ newlines — these are the model's intended paragraph
 *      boundaries and are always respected.
 *   3. Within each block, merge single newlines into spaces.  LLMs often
 *      wrap long lines inside a paragraph with \n; those soft breaks are
 *      NOT paragraph separators.  Converting them to spaces avoids the
 *      "one sentence per paragraph" pattern caused by blind \n→\n\n promotion.
 *   4. Count the sentences in each merged block using sentence-ending
 *      punctuation as the boundary marker:
 *      - If the block has ≤ maxSentencesToKeep sentences AND is under the
 *        character safety limit → keep it as one paragraph (no change).
 *      - Otherwise → group its sentences into shorter paragraphs of
 *        `groupSize` sentences each, still respecting the character limit.
 *   5. Discard empty blocks; join all final paragraphs with "\n\n".
 *
 * Per-language settings:
 *   - Arabic (ar):    keep if ≤ 3 sentences; group into 2-sentence paragraphs;
 *                     safety limit 600 chars.
 *   - English/French: keep if ≤ 4 sentences; group into 3-sentence paragraphs;
 *                     safety limit 900 chars.
 *
 * Never logs content. Never removes characters.
 */
export function normalizeGeneratedStoryContent(
  content: string,
  language: StoryRequest["language"],
): string {
  const isArabic           = language === "ar";
  const maxSentencesToKeep = isArabic ? 3 : 4;   // keep block intact if ≤ this many sentences
  const groupSize          = isArabic ? 2 : 3;   // sentences per group when splitting is needed
  const charLimit          = isArabic ? 600 : 900; // character safety limit per paragraph

  const normalised = content
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");

  const rawBlocks = normalised.split(/\n{2,}/);
  const finalParagraphs: string[] = [];

  for (const block of rawBlocks) {
    // Merge internal soft line-wraps into spaces; drop purely whitespace blocks.
    const merged = block.replace(/\n/g, " ").trim();
    if (!merged) continue;

    const sentences = extractSentences(merged);

    if (sentences.length <= maxSentencesToKeep && merged.length <= charLimit) {
      // Already appropriately sized — keep as-is.
      finalParagraphs.push(merged);
    } else {
      // Too many sentences or too long — group into natural paragraph chunks.
      finalParagraphs.push(...groupSentencesIntoParagraphs(sentences, groupSize, charLimit));
    }
  }

  return finalParagraphs.join("\n\n");
}

// ── Network layer ─────────────────────────────────────────────────────────────

/**
 * Suffix appended to the prompt on the second attempt when the first response
 * could not be parsed as valid JSON.
 */
const STRICT_JSON_SUFFIX =
  "\n\nReturn only a valid JSON object. No markdown. No commentary. Escape all quotation marks inside string values.";

const MISTRAL_TIMEOUT_MS = 45_000;
const TRANSIENT_RETRY_DELAY_MS = 1_500;

/** Minimal shape of a Mistral chat completion response. */
interface MistralApiResponse {
  choices: Array<{
    finish_reason?: string | null;
    message: { content: string };
  }>;
}

/**
 * Fetches the Mistral API with a 45-second AbortController timeout.
 * Retries once on transient failures (network errors, 429, 5xx).
 * Does NOT retry on timeout -- a second attempt would very likely also time out.
 * Does NOT retry on 400/401/403 -- those are permanent provider errors.
 * Never logs the Authorization header, request body, or generated content.
 */
async function fetchMistral(
  apiKey: string,
  body: string,
  retriesLeft = 1,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), MISTRAL_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(MISTRAL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body,
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timer);
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error("Mistral request timed out after 45 s");
    }
    if (retriesLeft > 0) {
      console.warn("[Mistral] network error, retrying once:", (err as Error).message);
      await new Promise((r) => setTimeout(r, TRANSIENT_RETRY_DELAY_MS));
      return fetchMistral(apiKey, body, retriesLeft - 1);
    }
    throw err;
  }
  clearTimeout(timer);

  if (!response.ok && retriesLeft > 0 && (response.status === 429 || response.status >= 500)) {
    const delay = response.status === 429 ? TRANSIENT_RETRY_DELAY_MS * 2 : TRANSIENT_RETRY_DELAY_MS;
    console.warn(`[Mistral] status ${response.status}, retrying once in ${delay} ms`);
    await new Promise((r) => setTimeout(r, delay));
    return fetchMistral(apiKey, body, retriesLeft - 1);
  }

  return response;
}

// ── Story generation ─────────────────────────────────────────────────────────

/**
 * Makes one complete generation attempt: HTTP fetch + truncation check + JSON parse.
 * Throws on any failure -- callers decide whether to retry.
 */
async function attemptGeneration(
  apiKey: string,
  prompt: string,
  language: StoryRequest["language"],
  wordCount: number,
): Promise<GeneratedStory> {
  const requestBody = JSON.stringify({
    model: MISTRAL_MODEL,
    temperature: 0.7,
    max_tokens: estimateMaxTokens(language, wordCount),
    response_format: { type: "json_object" },
    messages: [{ role: "user", content: prompt }],
  });

  const response = await fetchMistral(apiKey, requestBody);

  if (!response.ok) {
    throw new Error(`Mistral error: HTTP ${response.status}`);
  }

  const data = await response.json() as MistralApiResponse;
  const choice = data.choices[0];

  // Detect truncation before attempting to parse potentially incomplete JSON.
  if (choice?.finish_reason === "length" || choice?.finish_reason === "model_length") {
    throw new Error("Mistral response was truncated before valid JSON completion");
  }

  const raw = choice?.message?.content;
  if (!raw) throw new Error("Mistral returned empty content");

  const story = parseGeneratedStoryJson(raw);

  // Normalise, promote lone newlines to paragraph breaks, and split any
  // overly-long paragraphs into shorter ones before saving.
  story.content = normalizeGeneratedStoryContent(story.content, language);

  return story;
}

/**
 * Generates a children's story via the Mistral API.
 *
 * Attempt 1: standard prompt.
 * Attempt 2 (only on JSON parse failure): same prompt with a strict JSON suffix.
 *
 * Truncation, timeout, empty response, and HTTP errors are not retried -- they
 * indicate conditions unlikely to improve on a second identical request.
 */
export async function generateStoryWithMistral(req: StoryRequest): Promise<GeneratedStory> {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) throw new Error("MISTRAL_API_KEY is not set");

  const wordCount = targetWordCount(req.childAge, req.language, req.duration);
  const basePrompt = buildPrompt(req);

  try {
    return await attemptGeneration(apiKey, basePrompt, req.language, wordCount);
  } catch (err) {
    // Only retry on JSON parse failures -- all other errors are thrown immediately.
    if (!(err instanceof Error) || err.message !== "Mistral returned invalid JSON") {
      throw err;
    }
  }

  // Second attempt: stricter JSON instruction discourages markdown wrapping and
  // unescaped quotation marks, the two most common causes of parse failures.
  return attemptGeneration(
    apiKey,
    basePrompt + STRICT_JSON_SUFFIX,
    req.language,
    wordCount,
  );
}
