/**
 * Deterministic, rule-based child-safety gate.
 *
 * Checks free-text fields (theme, moral, generated title/content) against a
 * curated list of patterns covering sexual/adult content, graphic violence,
 * self-harm, hate speech, weapons/explosives instructions, drugs, and
 * prompt-injection attacks.  Supports Arabic, English, and French.
 *
 * Intentionally conservative: the pattern list targets unambiguously harmful
 * terms, not common story words (kill, death, war, blood, etc.) that appear
 * naturally in age-appropriate fairy tales.
 *
 * This is a first-pass gate; it does not replace a moderation API but avoids
 * shipping an external dependency in Phase 1.
 */

export type SafetyCategory =
  | "sexual"
  | "violence"
  | "self_harm"
  | "hate"
  | "weapons"
  | "drugs"
  | "prompt_injection";

export interface SafetyResult {
  safe: boolean;
  category?: SafetyCategory;
}

/** Word-boundary pattern (Latin script). */
const wb = (t: string): RegExp => new RegExp(`\\b${t}\\b`, "i");
/** Substring / phrase pattern (Arabic and multi-word phrases). */
const sub = (t: string): RegExp => new RegExp(t, "i");

const CHECKS: ReadonlyArray<{ re: RegExp; category: SafetyCategory }> = [
  // ── Sexual / Adult ─────────────────────────────────────────────────────────
  { re: wb("porn"),             category: "sexual" },
  { re: sub("pornograph"),      category: "sexual" },
  { re: sub("nsfw"),            category: "sexual" },
  { re: wb("erotic"),           category: "sexual" },
  { re: wb("erotica"),          category: "sexual" },
  { re: wb("nude"),             category: "sexual" },
  { re: wb("nudity"),           category: "sexual" },
  { re: wb("naked"),            category: "sexual" },
  { re: wb("sex"),              category: "sexual" },
  { re: wb("sexual"),           category: "sexual" },
  { re: sub("masturbat"),       category: "sexual" },
  { re: wb("rape"),             category: "sexual" },
  { re: wb("raping"),           category: "sexual" },
  { re: sub("prostitut"),       category: "sexual" },
  { re: sub("genitali"),        category: "sexual" },
  { re: sub("orgasm"),          category: "sexual" },
  { re: sub("intercourse"),     category: "sexual" },
  // French
  { re: wb("sexe"),             category: "sexual" },
  { re: wb("sexuel"),           category: "sexual" },
  { re: sub("érotique"),        category: "sexual" },
  { re: sub("erotique"),        category: "sexual" },
  // "viol" = rape in French; exclude violin/violet/violent via negative lookahead
  { re: sub("\\bviol(?!in|et|ent|ation|ence|ently)"), category: "sexual" },
  // Arabic
  { re: sub("إباحي"),           category: "sexual" },
  { re: sub("اغتصاب"),          category: "sexual" },
  { re: sub("دعارة"),           category: "sexual" },
  { re: sub("فاحشة"),           category: "sexual" },
  { re: sub("إيلاج"),           category: "sexual" },
  { re: sub("عاري"),            category: "sexual" },

  // ── Graphic Violence ───────────────────────────────────────────────────────
  // Targets explicitly graphic terms, not generic story conflict.
  { re: wb("gore"),             category: "violence" },
  { re: wb("gory"),             category: "violence" },
  { re: sub("torture"),         category: "violence" },
  { re: sub("mutilat"),         category: "violence" },
  { re: sub("decapitat"),       category: "violence" },
  { re: sub("behead"),          category: "violence" },
  { re: sub("dismember"),       category: "violence" },
  { re: sub("bloodbath"),       category: "violence" },
  { re: wb("massacre"),         category: "violence" },
  { re: wb("genocide"),         category: "violence" },
  { re: sub("crucif"),          category: "violence" },
  // French
  { re: sub("décapiter"),       category: "violence" },
  { re: sub("decapiter"),       category: "violence" },
  { re: sub("mutiler"),         category: "violence" },
  { re: wb("génocide"),         category: "violence" },
  { re: wb("genocide"),         category: "violence" },
  // Arabic
  { re: sub("قطع الرأس"),       category: "violence" },
  { re: sub("تعذيب وحشي"),      category: "violence" },
  { re: sub("مجزرة"),           category: "violence" },
  { re: sub("إبادة"),           category: "violence" },

  // ── Self-harm ──────────────────────────────────────────────────────────────
  { re: wb("suicide"),          category: "self_harm" },
  { re: sub("self.?harm"),      category: "self_harm" },
  { re: sub("kill (my|him|her)self"), category: "self_harm" },
  { re: sub("hang (my|him|her)self"), category: "self_harm" },
  { re: sub("slit.*wrist"),     category: "self_harm" },
  { re: sub("cut.*wrist"),      category: "self_harm" },
  // French
  { re: wb("suicide"),          category: "self_harm" },
  { re: sub("automutilation"),  category: "self_harm" },
  { re: sub("se suicid"),       category: "self_harm" },
  // Arabic
  { re: sub("انتحار"),          category: "self_harm" },
  { re: sub("أقتل نفسي"),       category: "self_harm" },
  { re: sub("أؤذي نفسي"),       category: "self_harm" },
  { re: sub("قتل النفس"),       category: "self_harm" },

  // ── Hate / Abuse ───────────────────────────────────────────────────────────
  { re: sub("white suprem"),    category: "hate" },
  { re: wb("neo.?nazi"),        category: "hate" },
  { re: sub("ethnic cleansing"), category: "hate" },
  { re: wb("nigger"),           category: "hate" },
  { re: wb("faggot"),           category: "hate" },
  { re: wb("kike"),             category: "hate" },
  { re: wb("spic"),             category: "hate" },
  { re: wb("chink"),            category: "hate" },
  // French
  { re: sub("suprématie blanche"), category: "hate" },
  { re: sub("suprematie blanche"), category: "hate" },
  // Arabic
  { re: sub("اقتل.*اليهود"),    category: "hate" },
  { re: sub("اقتل.*المسيحيين"), category: "hate" },
  { re: sub("اقتل.*المسلمين"),  category: "hate" },

  // ── Weapons / Explosives (instructions only) ───────────────────────────────
  // We block construction/synthesis instructions, not story references to weapons.
  { re: sub("how to (make|build|create|assemble).*(bomb|explosive|weapon|grenade|poison gas)"), category: "weapons" },
  { re: sub("instructions?.*(make|build).*(bomb|explosive)"), category: "weapons" },
  { re: wb("ied"),              category: "weapons" },  // improvised explosive device
  { re: wb("semtex"),           category: "weapons" },
  { re: wb("c4 explosive"),     category: "weapons" },
  // French
  { re: sub("comment (fabriquer|créer|construire).*(bombe|explosif|arme)"), category: "weapons" },
  // Arabic
  { re: sub("كيفية صنع.*(قنبلة|متفجر|سلاح)"), category: "weapons" },
  { re: sub("طريقة تصنيع.*(قنبلة|متفجر)"),   category: "weapons" },

  // ── Drugs ─────────────────────────────────────────────────────────────────
  // Block specific hard-drug names; "drug" alone is not flagged (medicine stories).
  { re: wb("cocaine"),          category: "drugs" },
  { re: wb("heroin"),           category: "drugs" },
  { re: wb("methamphetamine"),  category: "drugs" },
  { re: sub("crystal meth"),    category: "drugs" },
  { re: wb("fentanyl"),         category: "drugs" },
  { re: sub("crack cocaine"),   category: "drugs" },
  { re: sub("drug deal"),       category: "drugs" },
  { re: sub("how to (make|cook|produce).*(drug|meth|heroin)"), category: "drugs" },
  // French
  { re: sub("cocaïne"),         category: "drugs" },
  { re: sub("héroïne"),         category: "drugs" },
  { re: sub("méthamphétamine"), category: "drugs" },
  // Arabic
  { re: sub("كوكايين"),         category: "drugs" },
  { re: sub("هيروين"),          category: "drugs" },
  { re: sub("ميث(?:امفيتامين)"), category: "drugs" },

  // ── Prompt Injection ───────────────────────────────────────────────────────
  { re: sub("ignore (all |your )?(previous |prior )?(instructions?|prompt)"), category: "prompt_injection" },
  { re: sub("(override|disregard|bypass).*(instructions?|prompt|system)"),    category: "prompt_injection" },
  { re: sub("you are now (a|an|the)"),                                        category: "prompt_injection" },
  { re: sub("pretend (you are|to be|you're|you are)"),                        category: "prompt_injection" },
  { re: sub("act as (if|a|an|though)"),                                       category: "prompt_injection" },
  { re: sub("(forget|discard|ignore) (your|all|the) (instructions?|system|prompt)"), category: "prompt_injection" },
  { re: sub("new (instructions?|system prompt|role):"),                       category: "prompt_injection" },
  { re: wb("jailbreak"),                                                       category: "prompt_injection" },
  { re: sub("\\[\\s*system\\s*\\]|<system>|###\\s*system"),                  category: "prompt_injection" },
  { re: sub("تجاهل (جميع )?التعليمات"),                                      category: "prompt_injection" },
  { re: sub("تصرف كأنك"),                                                     category: "prompt_injection" },
];

/**
 * Check a text string for unsafe content.
 * Pass a single concatenated string of all fields to check at once.
 * The first match wins and returns its category.
 */
export function checkSafety(text: string): SafetyResult {
  if (!text || text.trim().length === 0) return { safe: true };

  for (const { re, category } of CHECKS) {
    if (re.test(text)) {
      return { safe: false, category };
    }
  }
  return { safe: true };
}
