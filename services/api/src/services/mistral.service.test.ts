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
import { parseGeneratedStoryJson, estimateMaxTokens } from "./mistral.service.js";

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
