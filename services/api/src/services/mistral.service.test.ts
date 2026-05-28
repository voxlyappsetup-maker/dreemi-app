/**
 * Unit tests for the deterministic helpers exported by mistral.service.ts.
 *
 * Constraints:
 *   - No network calls.
 *   - No environment variables read or required.
 *   - No database access.
 *   - Uses Node.js built-in test runner via tsx.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseGeneratedStoryJson, estimateMaxTokens, normalizeGeneratedStoryContent } from "./mistral.service.js";

// ── parseGeneratedStoryJson ───────────────────────────────────────────────────

describe("parseGeneratedStoryJson", () => {

  it("parses a valid JSON string", () => {
    const raw = JSON.stringify({
      title: "The Fox and the Moon",
      content: "Once upon a time a little fox looked up.\n\nShe smiled at the moon.",
      moral: "Curiosity leads to wonder.",
    });
    const result = parseGeneratedStoryJson(raw);
    assert.equal(result.title, "The Fox and the Moon");
    assert.ok(result.content.includes("fox"));
    assert.equal(result.moral, "Curiosity leads to wonder.");
  });

  it("parses a fenced ```json code block", () => {
    const raw = "```json\n" + JSON.stringify({
      title: "The Brave Rabbit",
      content: "A rabbit lived in the forest.\n\nShe was very brave.",
      moral: "Bravery wins the day.",
    }) + "\n```";
    const result = parseGeneratedStoryJson(raw);
    assert.equal(result.title, "The Brave Rabbit");
  });

  it("parses a fenced ``` code block without language tag", () => {
    const raw = "```\n" + JSON.stringify({
      title: "Stars and Dreams",
      content: "The child looked at the stars.\n\nShe dreamed of flying.",
      moral: "",
    }) + "\n```";
    const result = parseGeneratedStoryJson(raw);
    assert.equal(result.title, "Stars and Dreams");
  });

  it("trims leading and trailing whitespace", () => {
    const raw = "   \n" + JSON.stringify({
      title: "River Song",
      content: "The river sang softly.\n\nAll the animals listened.",
      moral: "Peace comes from nature.",
    }) + "\n   ";
    const result = parseGeneratedStoryJson(raw);
    assert.equal(result.title, "River Song");
  });

  it("normalises moral to empty string when absent", () => {
    const raw = JSON.stringify({
      title: "The Little Cloud",
      content: "A cloud floated over the mountains.\n\nIt brought cool rain.",
    });
    const result = parseGeneratedStoryJson(raw);
    assert.equal(result.moral, "");
  });

  it("normalises moral to empty string when null", () => {
    const raw = JSON.stringify({
      title: "The Little Cloud",
      content: "A cloud floated over the mountains.\n\nIt brought cool rain.",
      moral: null,
    });
    const result = parseGeneratedStoryJson(raw);
    assert.equal(result.moral, "");
  });

  it("trims whitespace from title, content, and moral", () => {
    const raw = JSON.stringify({
      title: "  The Garden  ",
      content: "  Flowers bloomed every spring.\n\nChildren played among them.  ",
      moral: "  Care for nature.  ",
    });
    const result = parseGeneratedStoryJson(raw);
    assert.equal(result.title, "The Garden");
    assert.equal(result.moral, "Care for nature.");
  });

  it("throws on missing title", () => {
    const raw = JSON.stringify({
      content: "A story without a title.",
      moral: "Some moral.",
    });
    assert.throws(
      () => parseGeneratedStoryJson(raw),
      (err: Error) => err.message === "Mistral returned invalid JSON",
    );
  });

  it("throws on empty title string", () => {
    const raw = JSON.stringify({
      title: "   ",
      content: "A story.",
      moral: "",
    });
    assert.throws(
      () => parseGeneratedStoryJson(raw),
      (err: Error) => err.message === "Mistral returned invalid JSON",
    );
  });

  it("throws on missing content", () => {
    const raw = JSON.stringify({
      title: "A Title",
      moral: "Some moral.",
    });
    assert.throws(
      () => parseGeneratedStoryJson(raw),
      (err: Error) => err.message === "Mistral returned invalid JSON",
    );
  });

  it("throws on empty content string", () => {
    const raw = JSON.stringify({
      title: "A Title",
      content: "   ",
      moral: "",
    });
    assert.throws(
      () => parseGeneratedStoryJson(raw),
      (err: Error) => err.message === "Mistral returned invalid JSON",
    );
  });

  it("throws on completely malformed JSON", () => {
    assert.throws(
      () => parseGeneratedStoryJson('{"title": "incomplete"'),
      (err: Error) => err.message === "Mistral returned invalid JSON",
    );
  });

  it("throws on an empty string", () => {
    assert.throws(
      () => parseGeneratedStoryJson(""),
      (err: Error) => err.message === "Mistral returned invalid JSON",
    );
  });

  it("throws on a JSON array instead of an object", () => {
    const raw = JSON.stringify([{ title: "T", content: "C" }]);
    assert.throws(
      () => parseGeneratedStoryJson(raw),
      (err: Error) => err.message === "Mistral returned invalid JSON",
    );
  });

  it("does not expose raw content in the error message", () => {
    const sensitiveRaw = '{"title": "", "content": "SECRET CHILD NAME lives here"}';
    try {
      parseGeneratedStoryJson(sensitiveRaw);
      assert.fail("Expected an error to be thrown");
    } catch (err) {
      const msg = (err as Error).message;
      assert.ok(
        !msg.includes("SECRET"),
        "Error message must not contain raw story content",
      );
    }
  });

  it("handles Arabic story JSON", () => {
    const raw = JSON.stringify({
      title: "ليلى ونجم الأحلام",
      content: "كانت ليلى تحب النجوم.\n\nفي كل ليلة كانت تنظر إلى السماء.",
      moral: "الفضول يفتح أبواب المعرفة.",
    });
    const result = parseGeneratedStoryJson(raw);
    assert.equal(result.title, "ليلى ونجم الأحلام");
    assert.ok(result.content.length > 0);
  });

});

// ── estimateMaxTokens ─────────────────────────────────────────────────────────

describe("estimateMaxTokens", () => {

  it("Arabic estimate is greater than English for the same word count", () => {
    const arTokens = estimateMaxTokens("ar", 700);
    const enTokens = estimateMaxTokens("en", 700);
    assert.ok(
      arTokens > enTokens,
      `Arabic (${arTokens}) should exceed English (${enTokens}) for 700 words`,
    );
  });

  it("Arabic estimate is greater than French for the same word count", () => {
    const arTokens = estimateMaxTokens("ar", 700);
    const frTokens = estimateMaxTokens("fr", 700);
    assert.ok(arTokens > frTokens);
  });

  it("Arabic token estimate is capped at 4096", () => {
    const tokens = estimateMaxTokens("ar", 5000);
    assert.equal(tokens, 4096);
  });

  it("English token estimate is capped at 4096", () => {
    const tokens = estimateMaxTokens("en", 5000);
    assert.equal(tokens, 4096);
  });

  it("French token estimate is capped at 4096", () => {
    const tokens = estimateMaxTokens("fr", 5000);
    assert.equal(tokens, 4096);
  });

  it("Arabic minimum is at least 2500 even for very short stories", () => {
    const tokens = estimateMaxTokens("ar", 50);
    assert.ok(tokens >= 2500, `Expected >= 2500, got ${tokens}`);
  });

  it("English minimum is at least 2000 even for very short stories", () => {
    const tokens = estimateMaxTokens("en", 50);
    assert.ok(tokens >= 2000, `Expected >= 2000, got ${tokens}`);
  });

  it("French minimum is at least 2000 even for very short stories", () => {
    const tokens = estimateMaxTokens("fr", 50);
    assert.ok(tokens >= 2000, `Expected >= 2000, got ${tokens}`);
  });

  it("returns a finite positive integer for a typical Arabic story", () => {
    const tokens = estimateMaxTokens("ar", 725);
    assert.ok(Number.isFinite(tokens));
    assert.ok(tokens > 0);
    // 725 * 4 = 2900 — within range
    assert.equal(tokens, 2900);
  });

  it("returns a finite positive integer for a typical English story", () => {
    const tokens = estimateMaxTokens("en", 800);
    assert.ok(Number.isFinite(tokens));
    // 800 * 2 = 1600 — below minimum, so 2000
    assert.equal(tokens, 2000);
  });

  it("scales correctly above the English minimum", () => {
    // 1200 * 2 = 2400 — above minimum of 2000, below cap
    const tokens = estimateMaxTokens("en", 1200);
    assert.equal(tokens, 2400);
  });

});

// ── normalizeGeneratedStoryContent ───────────────────────────────────────────

describe("normalizeGeneratedStoryContent", () => {

  it("removes carriage returns from CRLF line endings", () => {
    const result = normalizeGeneratedStoryContent("Line one.\r\nLine two.", "en");
    assert.ok(!result.includes("\r"), "Output must not contain \\r");
  });

  it("removes bare CR characters", () => {
    const result = normalizeGeneratedStoryContent("Line one.\rLine two.", "en");
    assert.ok(!result.includes("\r"));
  });

  it("preserves existing double-newline paragraph breaks", () => {
    const input = "Paragraph one sentence.\n\nParagraph two sentence.";
    const result = normalizeGeneratedStoryContent(input, "en");
    const paras = result.split("\n\n");
    assert.equal(paras.length, 2);
    assert.ok(paras[0].includes("Paragraph one"));
    assert.ok(paras[1].includes("Paragraph two"));
  });

  it("single newlines within a block are treated as soft breaks and merged into the paragraph", () => {
    // A lone \n is a soft line-wrap, not a paragraph separator.
    // Two short sentences joined by \n should stay in the same paragraph.
    const input = "Paragraph one.\nParagraph two.";
    const result = normalizeGeneratedStoryContent(input, "en");
    const paras = result.split("\n\n");
    assert.equal(paras.length, 1, "Two short sentences separated by \\n should remain one paragraph");
    assert.ok(result.includes("Paragraph one"));
    assert.ok(result.includes("Paragraph two"));
  });

  it("discards empty paragraph blocks", () => {
    const input = "Para one.\n\n\n\n\n\nPara two.";
    const result = normalizeGeneratedStoryContent(input, "en");
    const paras = result.split("\n\n");
    assert.equal(paras.length, 2);
    for (const p of paras) {
      assert.ok(p.trim().length > 0, "Must produce no empty paragraphs");
    }
  });

  it("produces no empty paragraphs for whitespace-only blocks", () => {
    const input = "First para.\n\n   \n\nSecond para.";
    const result = normalizeGeneratedStoryContent(input, "en");
    const paras = result.split("\n\n");
    for (const p of paras) {
      assert.ok(p.trim().length > 0, `Empty paragraph found: "${p}"`);
    }
  });

  it("does not drop any story words", () => {
    const input = "The brave fox. The clever rabbit.\n\nThey lived happily.";
    const result = normalizeGeneratedStoryContent(input, "en");
    assert.ok(result.includes("brave fox"));
    assert.ok(result.includes("clever rabbit"));
    assert.ok(result.includes("happily"));
  });

  it("splits a long English paragraph exceeding 900 chars into multiple paragraphs", () => {
    const sentence = "The little explorer walked through the ancient forest and found many wonders.";
    const longBlock = Array(13).fill(sentence).join(" ");
    assert.ok(longBlock.length > 900, "test precondition: block must be > 900 chars");
    const result = normalizeGeneratedStoryContent(longBlock, "en");
    const paras = result.split("\n\n");
    assert.ok(paras.length > 1, `Expected split paragraphs, got ${paras.length}`);
  });

  it("splits a long Arabic paragraph exceeding 600 chars into multiple paragraphs", () => {
    const sentence = "ذهب الولد الصغير إلى الغابة ووجد أصدقاء جدد وعاش سعيداً.";
    const longBlock = Array(11).fill(sentence).join(" ");
    assert.ok(longBlock.length > 600, "test precondition: block must be > 600 chars");
    const result = normalizeGeneratedStoryContent(longBlock, "ar");
    const paras = result.split("\n\n");
    assert.ok(paras.length > 1, `Expected split paragraphs for Arabic, got ${paras.length}`);
  });

  it("Arabic produces more (smaller) paragraph groups than English for the same multi-sentence input", () => {
    // 8 Arabic sentences separated by spaces — exceeds both language thresholds.
    const sentence = "هذه جملة قصيرة للاختبار.";
    const block = Array(8).fill(sentence).join(" ");

    const arResult = normalizeGeneratedStoryContent(block, "ar");
    const enResult = normalizeGeneratedStoryContent(block, "en");

    const arCount = arResult.split("\n\n").length;
    const enCount = enResult.split("\n\n").length;

    assert.ok(arCount > 1, "Arabic: 8 sentences should produce multiple paragraphs");
    assert.ok(enCount > 1, "English: 8 sentences should produce multiple paragraphs");
    // Arabic groupSize (2) < English groupSize (3), so Arabic produces more, smaller groups.
    assert.ok(arCount >= enCount, `Arabic (${arCount}) should have >= paragraphs as English (${enCount})`);
  });

  it("joining paragraphs with \\n\\n never produces a leading or trailing \\n\\n", () => {
    const input = "Only one paragraph here with enough text to fit.";
    const result = normalizeGeneratedStoryContent(input, "en");
    assert.ok(!result.startsWith("\n"), "Should not start with newline");
    assert.ok(!result.endsWith("\n"), "Should not end with newline");
  });

  it("handles an already well-formed Arabic multi-paragraph story without altering structure", () => {
    const input = "الفقرة الأولى من القصة.\n\nالفقرة الثانية من القصة.\n\nالفقرة الثالثة من القصة.";
    const result = normalizeGeneratedStoryContent(input, "ar");
    const paras = result.split("\n\n");
    assert.equal(paras.length, 3);
  });

  it("Arabic: three short sentences separated by single newlines merge into one natural paragraph", () => {
    // This is the classic bad-LLM pattern: \n between sentences instead of \n\n.
    // With the new normaliser the three sentences must NOT become three paragraphs.
    const input = "ذهب سامي إلى المدرسة.\nالتقى بصديقه الجديد.\nلعبا معاً في الحديقة.";
    const result = normalizeGeneratedStoryContent(input, "ar");
    const paras = result.split("\n\n");
    // 3 sentences ≤ maxSentencesToKeep (3) → one paragraph
    assert.equal(paras.length, 1,
      `Expected 1 paragraph (3 sentences ≤ Arabic max), got ${paras.length}`);
    assert.ok(result.includes("سامي"));
    assert.ok(result.includes("صديقه"));
    assert.ok(result.includes("الحديقة"));
  });

  it("Arabic: six sentences with single newlines group into natural multi-sentence paragraphs, not one-per-sentence", () => {
    // 6 sentences → exceeds Arabic max (3) → grouped into 2-sentence paragraphs → 3 paragraphs
    const input = [
      "ذهب سامي إلى المدرسة.",
      "التقى بصديقه الجديد.",
      "لعبا معاً في الحديقة.",
      "رأى سامي فراشة جميلة.",
      "حاول أن يمسكها لكنها طارت.",
      "ضحك الصديقان معاً.",
    ].join("\n");
    const result = normalizeGeneratedStoryContent(input, "ar");
    const paras = result.split("\n\n");
    // Must NOT be 6 (one-per-sentence).
    assert.ok(paras.length < 6,
      `Should not produce one paragraph per sentence; got ${paras.length}`);
    // Must NOT be 1 (all merged into one dense block).
    assert.ok(paras.length > 1,
      `Should split 6 sentences into multiple paragraphs; got ${paras.length}`);
    // No content dropped.
    assert.ok(result.includes("سامي"));
    assert.ok(result.includes("فراشة"));
    assert.ok(result.includes("الصديقان"));
  });

  it("English: five sentences with single newlines group naturally — not one-per-sentence", () => {
    const input = [
      "The brave fox walked into the dark forest.",
      "She heard a soft rustle among the leaves.",
      "A tiny hedgehog peeked out from behind a tree.",
      "The fox smiled and offered a piece of bread.",
      "They sat together and watched the stars appear.",
    ].join("\n");
    const result = normalizeGeneratedStoryContent(input, "en");
    const paras = result.split("\n\n");
    // 5 sentences > English max (4) → group into 3s → 2 paragraphs (3+2)
    assert.ok(paras.length < 5, `Should not produce one paragraph per sentence; got ${paras.length}`);
    assert.ok(paras.length > 0);
    // All words present
    assert.ok(result.includes("brave fox"));
    assert.ok(result.includes("hedgehog"));
    assert.ok(result.includes("stars"));
  });

  it("a well-formed paragraph with 2 Arabic sentences kept exactly as-is", () => {
    const input = "كان يا ما كان في قديم الزمان ملك حكيم. عاش في قصر جميل على قمة الجبل.";
    const result = normalizeGeneratedStoryContent(input, "ar");
    const paras = result.split("\n\n");
    // 2 sentences ≤ maxSentencesToKeep (3) → unchanged
    assert.equal(paras.length, 1);
    assert.ok(result.includes("ملك حكيم"));
    assert.ok(result.includes("قمة الجبل"));
  });

  it("splits a long unpunctuated English block (>900) into multiple paragraphs", () => {
    const block = Array(230).fill("sunshine").join(" ");
    assert.ok(block.length > 900, "test precondition: block must be > 900 chars");
    const result = normalizeGeneratedStoryContent(block, "en");
    const paras = result.split("\n\n");
    assert.ok(paras.length > 1, "Expected unpunctuated English block to be split");
  });

  it("splits a long unpunctuated Arabic block (>600) into multiple paragraphs", () => {
    const block = Array(170).fill("نور").join(" ");
    assert.ok(block.length > 600, "test precondition: block must be > 600 chars");
    const result = normalizeGeneratedStoryContent(block, "ar");
    const paras = result.split("\n\n");
    assert.ok(paras.length > 1, "Expected unpunctuated Arabic block to be split");
  });

  it("does not drop words during fallback splitting of long unpunctuated blocks", () => {
    const words = [
      "anchorOne",
      ...Array(210).fill("middleword"),
      "anchorTwo",
      "anchorThree",
    ];
    const block = words.join(" ");
    const result = normalizeGeneratedStoryContent(block, "en");

    assert.ok(result.includes("anchorOne"));
    assert.ok(result.includes("anchorTwo"));
    assert.ok(result.includes("anchorThree"));
  });

  it("fallback-split paragraphs stay within configured limits when whitespace cuts are available", () => {
    const enBlock = Array(250).fill("cloud").join(" ");
    const arBlock = Array(220).fill("قمر").join(" ");

    const enResult = normalizeGeneratedStoryContent(enBlock, "en");
    const arResult = normalizeGeneratedStoryContent(arBlock, "ar");

    for (const p of enResult.split("\n\n")) {
      assert.ok(p.length <= 900, `English paragraph exceeded 900 chars: ${p.length}`);
    }
    for (const p of arResult.split("\n\n")) {
      assert.ok(p.length <= 600, `Arabic paragraph exceeded 600 chars: ${p.length}`);
    }
  });

});
