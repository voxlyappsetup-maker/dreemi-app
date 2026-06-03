/**
 * Static security regression tests for services/api/src/routes/stories.ts
 *
 * Strategy: read the TypeScript source as plain text and assert structural
 * properties — auth guards, middleware order, safety gate ordering, absence of
 * insecure patterns — without importing the module.  Importing would trigger
 * Prisma client initialization, JWT setup, and Express server side effects.
 *
 * These tests act as a "security linter" that fails CI if Phase 2B protections
 * are accidentally removed or bypassed during future refactors.
 *
 * No environment variables, no network, no database access.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

// ── Load source once ─────────────────────────────────────────────────────────

const STORIES_PATH = path.resolve(__dirname, "stories.ts");
const src: string = fs.readFileSync(STORIES_PATH, "utf-8");
const PLANS_MIDDLEWARE_PATH = path.resolve(__dirname, "../middleware/plans.middleware.ts");
const CHILDREN_ROUTE_PATH = path.resolve(__dirname, "children.ts");
const PAYMENTS_ROUTE_PATH = path.resolve(__dirname, "payments.ts");
const plansSrc: string = fs.readFileSync(PLANS_MIDDLEWARE_PATH, "utf-8");
const childrenSrc: string = fs.readFileSync(CHILDREN_ROUTE_PATH, "utf-8");
const paymentsSrc: string = fs.readFileSync(PAYMENTS_ROUTE_PATH, "utf-8");

// ── Helper utilities ─────────────────────────────────────────────────────────

/** First index of pattern in src, or -1. */
function find(pattern: string | RegExp): number {
  if (typeof pattern === "string") return src.indexOf(pattern);
  const m = src.match(pattern);
  return m?.index ?? -1;
}

/** Find first occurrence of a string starting from startIdx. */
function findFrom(needle: string, startIdx: number): number {
  return src.indexOf(needle, startIdx);
}

/**
 * Assert pattern exists; return its character index so callers can chain
 * relative-order assertions.
 */
function mustExist(pattern: string | RegExp, label: string): number {
  const idx = find(pattern);
  assert.ok(idx >= 0, `MISSING — ${label}\n  pattern: ${pattern}`);
  return idx;
}

/** Assert pattern is absent from the file. */
function mustAbsent(pattern: string | RegExp, label: string): void {
  const idx = find(pattern);
  assert.ok(idx === -1, `UNEXPECTED — ${label}\n  pattern: ${pattern}\n  found at char ${idx}`);
}

/**
 * Assert A appears strictly before B.
 * Both indices must be ≥ 0 (patterns must exist).
 */
function mustBeBefore(
  aIdx: number, aLabel: string,
  bIdx: number, bLabel: string,
): void {
  assert.ok(
    aIdx >= 0 && bIdx >= 0 && aIdx < bIdx,
    `ORDER VIOLATION — "${aLabel}" (pos ${aIdx}) must appear before "${bLabel}" (pos ${bIdx})`,
  );
}

// ── 1. GET / authentication ───────────────────────────────────────────────────

describe('stories.ts — GET "/" authentication', () => {
  it('storiesRouter.get("/", …) registers authenticateToken as the first middleware', () => {
    mustExist(
      'storiesRouter.get("/", authenticateToken',
      'storiesRouter.get("/", authenticateToken must be the first arg after the route path',
    );
  });
});

// ── 2. GET / userId source ────────────────────────────────────────────────────

describe('stories.ts — GET "/" does not trust userId from query string', () => {
  it("does not read userId via req.query.userId", () => {
    mustAbsent(
      "req.query.userId",
      "req.query.userId must not appear — userId must come from the JWT, not from client-supplied query params",
    );
  });

  it("does not destructure userId out of req.query", () => {
    // Catches patterns like:
    //   const { userId } = req.query
    //   const { userId, childId } = req.query
    mustAbsent(
      /const\s*\{[^}]*\buserId\b[^}]*\}\s*=\s*req\.query/,
      "userId must not be destructured from req.query — use req.userId set by authenticateToken",
    );
  });

  it("uses req.userId (populated by authenticateToken) as the caller identity", () => {
    mustExist(
      "req.userId",
      "req.userId must be the source of truth for the calling user's identity",
    );
  });
});

// ── 3. GET / childId ownership check ─────────────────────────────────────────

describe('stories.ts — GET "/" childId ownership verification order', () => {
  it("reads childId from req.query", () => {
    mustExist(
      "const { childId } = req.query",
      "childId must be read from req.query (safe — it is only a filter, not an identity claim)",
    );
  });

  it("calls prisma.child.findUnique to verify childId ownership", () => {
    mustExist(
      "prisma.child.findUnique",
      "prisma.child.findUnique must be used to resolve childId to a DB record with a userId",
    );
  });

  it("compares child.userId to the authenticated userId", () => {
    mustExist(
      "child.userId !== userId",
      "child.userId !== userId ownership check must exist to prevent cross-user data access",
    );
  });

  it("applies where.childId only AFTER the ownership check (correct order)", () => {
    const childQueryIdx   = mustExist("const { childId } = req.query", "childId from req.query");
    const findUniqueIdx   = mustExist("prisma.child.findUnique",        "prisma.child.findUnique");
    const ownerCheckIdx   = mustExist("child.userId !== userId",         "child.userId ownership check");
    const whereChildIdIdx = mustExist("where.childId = childId",         "where.childId assignment");

    mustBeBefore(childQueryIdx,   "childId from req.query",         findUniqueIdx,   "prisma.child.findUnique");
    mustBeBefore(findUniqueIdx,   "prisma.child.findUnique",        ownerCheckIdx,   "child.userId ownership check");
    mustBeBefore(ownerCheckIdx,   "child.userId ownership check",   whereChildIdIdx, "where.childId assignment");
  });
});

// ── 4. POST /generate middleware stack ────────────────────────────────────────

describe("stories.ts — POST /generate middleware stack", () => {
  it("generate route exists", () => {
    mustExist('storiesRouter.post(',  "storiesRouter.post( must exist");
    mustExist('"/generate"',          '"/generate" route path must be registered');
  });

  it("authenticateToken is in the generate route, before the async handler", () => {
    const routePos        = mustExist('"/generate"',          '"/generate" route position');
    const authPos         = findFrom("authenticateToken",     routePos);
    const asyncHandlerPos = findFrom("async (req: Request",  routePos);
    assert.ok(authPos > routePos,         "authenticateToken must appear in the generate route args");
    assert.ok(asyncHandlerPos > authPos,  "authenticateToken must come before the async handler body");
  });

  it("generateRateLimit is in the generate route, before the async handler", () => {
    const routePos        = mustExist('"/generate"',          '"/generate" route position');
    const rateLimitPos    = findFrom("generateRateLimit",     routePos);
    const asyncHandlerPos = findFrom("async (req: Request",  routePos);
    assert.ok(rateLimitPos > routePos,        "generateRateLimit must appear in the generate route args");
    assert.ok(asyncHandlerPos > rateLimitPos, "generateRateLimit must come before the async handler body");
  });

  it("checkStoryLimit is in the generate route, before the async handler", () => {
    const routePos        = mustExist('"/generate"',          '"/generate" route position');
    const planLimitPos    = findFrom("checkStoryLimit",       routePos);
    const asyncHandlerPos = findFrom("async (req: Request",  routePos);
    assert.ok(planLimitPos > routePos,        "checkStoryLimit must appear in the generate route args");
    assert.ok(asyncHandlerPos > planLimitPos, "checkStoryLimit must come before the async handler body");
  });

  it("middleware order is: authenticateToken → generateRateLimit → checkStoryLimit → async handler", () => {
    const routePos        = mustExist('"/generate"',          '"/generate" route');
    const authPos         = findFrom("authenticateToken",     routePos);
    const rateLimitPos    = findFrom("generateRateLimit",     routePos);
    const planLimitPos    = findFrom("checkStoryLimit",       routePos);
    const asyncHandlerPos = findFrom("async (req: Request",  routePos);

    mustBeBefore(authPos,       "authenticateToken",  rateLimitPos,     "generateRateLimit");
    mustBeBefore(rateLimitPos,  "generateRateLimit",  planLimitPos,     "checkStoryLimit");
    mustBeBefore(planLimitPos,  "checkStoryLimit",    asyncHandlerPos,  "async handler");
  });
});

// ── 4B. Pre-D3K story-limit baseline lock (middleware source of truth) ───────

describe("plans.middleware.ts — pre-D3K story-limit baseline lock", () => {
  it("keeps checkStoryLimit defined in plans middleware", () => {
    assert.match(
      plansSrc,
      /export\s+async\s+function\s+checkStoryLimit\s*\(/,
      "checkStoryLimit must remain defined in plans.middleware.ts for pre-D3K baseline",
    );
  });

  it("keeps FREE_MONTHLY_LIMIT set to 3", () => {
    assert.match(
      plansSrc,
      /const\s+FREE_MONTHLY_LIMIT\s*=\s*3\s*;/,
      "FREE_MONTHLY_LIMIT must remain 3 in pre-D3K baseline",
    );
  });

  it("keeps non-FREE bypass in legacy story-limit path", () => {
    assert.match(
      plansSrc,
      /if\s*\(\s*user\.plan\s*!==\s*"FREE"\s*\)\s*\{[\s\S]*next\(\);[\s\S]*return;[\s\S]*\}/,
      "non-FREE bypass must remain in plans.middleware.ts before any D3K wiring",
    );
  });

  it("keeps user identity source on req.userId and not query/body userId", () => {
    assert.match(
      plansSrc,
      /const\s+userId\s*=\s*req\.userId\s*;/,
      "plans middleware must use authenticated req.userId",
    );
    assert.equal(
      /req\.query\.userId|req\.body\.userId/.test(plansSrc),
      false,
      "plans middleware must not use query/body userId for story limit counting",
    );
  });

  it("keeps month-start window counting via createdAt >= monthStart", () => {
    assert.match(
      plansSrc,
      /const\s+monthStart\s*=\s*new\s+Date\(\s*now\.getFullYear\(\),\s*now\.getMonth\(\),\s*1\s*\)\s*;/,
      "monthStart computation must remain in legacy story-limit path",
    );
    assert.match(
      plansSrc,
      /createdAt:\s*\{\s*gte:\s*monthStart\s*\}/,
      "story count must remain bounded by createdAt >= monthStart",
    );
  });

  it("keeps STORY_LIMIT_REACHED code and blocked response shape fields", () => {
    assert.match(
      plansSrc,
      /res\.status\(403\)\.json\(\{[\s\S]*success:\s*false,[\s\S]*error:[\s\S]*code:\s*"STORY_LIMIT_REACHED"[\s\S]*\}\)/,
      "blocked story-limit response must keep success/error/code with STORY_LIMIT_REACHED",
    );
  });
});

// ── 4C. Pre-D3K non-wiring lock for runtime surfaces ──────────────────────────

describe("pre-D3K runtime non-wiring lock for story-generation surface", () => {
  it("keeps plans.middleware.ts non-wired to EntitlementService pre-D3K", () => {
    assert.equal(
      /EntitlementService|createEntitlementService|entitlement\.service|getEffectiveEntitlement|getPlanForAccessCheck|canGenerateStory|getChildLimit/.test(
        plansSrc,
      ),
      false,
      "plans.middleware.ts must remain non-wired before D3K implementation",
    );
  });

  it("keeps stories.ts non-wired to EntitlementService pre-D3K", () => {
    assert.equal(
      /EntitlementService|createEntitlementService|entitlement\.service|getEffectiveEntitlement|getPlanForAccessCheck|canGenerateStory|getChildLimit/.test(
        src,
      ),
      false,
      "stories.ts must remain non-wired before D3K implementation",
    );
  });

  it("keeps payments.ts non-wired to EntitlementService pre-D3K", () => {
    assert.equal(
      /EntitlementService|createEntitlementService|entitlement\.service|getEffectiveEntitlement|getPlanForAccessCheck|canGenerateStory|getChildLimit/.test(
        paymentsSrc,
      ),
      false,
      "payments.ts must remain non-wired before D3K implementation",
    );
  });

  it("keeps children.ts as the only runtime EntitlementService wiring surface", () => {
    const entitlementSurfacePattern =
      /EntitlementService|createEntitlementService|entitlement\.service|getEffectiveEntitlement|getPlanForAccessCheck|canGenerateStory|getChildLimit/;
    assert.equal(entitlementSurfacePattern.test(childrenSrc), true);
    assert.equal(entitlementSurfacePattern.test(src), false);
    assert.equal(entitlementSurfacePattern.test(plansSrc), false);
    assert.equal(entitlementSurfacePattern.test(paymentsSrc), false);
  });

  it("keeps D3G child-limit entitlement call unchanged", () => {
    assert.match(childrenSrc, /createEntitlementService/);
    assert.match(childrenSrc, /getChildLimit\(\s*userId,\s*user\.plan\s*\)/);
    // Pre-D3K baseline note: if D3K wires plans.middleware, update only that
    // specific guardrail and keep stories.ts/payments.ts non-wired unless
    // explicit approval expands scope.
  });
});

// ── 5. Rate-limit error code ──────────────────────────────────────────────────

describe("stories.ts — rate-limit stable error code", () => {
  it("RATE_LIMIT_EXCEEDED is the stable error code in the rate-limit response body", () => {
    mustExist(
      "RATE_LIMIT_EXCEEDED",
      "RATE_LIMIT_EXCEEDED must exist as the stable, client-readable error code for throttled requests",
    );
  });
});

// ── 6. Input safety gate (before Mistral) ────────────────────────────────────

describe("stories.ts — input safety gate ordering", () => {
  it("checkSafety is called on user-supplied input fields", () => {
    mustExist(
      "checkSafety(inputText)",
      "checkSafety(inputText) must be called to screen theme/moral before sending them to Mistral",
    );
  });

  it("input safety check appears BEFORE the Mistral call", () => {
    const inputCheckPos = mustExist("checkSafety(inputText)",            "checkSafety(inputText)");
    const mistralPos    = mustExist("generateStoryWithMistral(storyInput)", "generateStoryWithMistral call");
    mustBeBefore(inputCheckPos, "checkSafety(inputText)", mistralPos, "generateStoryWithMistral");
  });

  it("UNSAFE_INPUT is the stable error code returned when user input is blocked", () => {
    mustExist(
      "UNSAFE_INPUT",
      "UNSAFE_INPUT must be the stable, client-readable error code for rejected user inputs",
    );
  });
});

// ── 7. Output safety gate (before persistence) ───────────────────────────────

describe("stories.ts — output safety gate ordering", () => {
  it("checkSafety is called on generated output fields", () => {
    mustExist(
      "checkSafety(outputText)",
      "checkSafety(outputText) must be called to screen generated title/content/moral before saving",
    );
  });

  it("output safety check appears AFTER the Mistral call (checks actual output, not input)", () => {
    const mistralPos     = mustExist("generateStoryWithMistral(storyInput)", "generateStoryWithMistral call");
    const outputCheckPos = mustExist("checkSafety(outputText)",              "checkSafety(outputText)");
    mustBeBefore(mistralPos, "generateStoryWithMistral", outputCheckPos, "checkSafety(outputText)");
  });

  it("output safety check appears BEFORE prisma.story.create", () => {
    const outputCheckPos = mustExist("checkSafety(outputText)",  "checkSafety(outputText)");
    const createPos      = mustExist("prisma.story.create(",     "prisma.story.create");
    mustBeBefore(outputCheckPos, "checkSafety(outputText)", createPos, "prisma.story.create");
  });

  it("GENERATION_FAILED is the stable error code returned when generated output is blocked", () => {
    mustExist(
      "GENERATION_FAILED",
      "GENERATION_FAILED must be the stable error code when the output safety gate fires",
    );
  });

  it("GENERATION_FAILED early-return appears BEFORE prisma.story.create — unsafe stories are never saved", () => {
    const failedPos = mustExist("GENERATION_FAILED",    "GENERATION_FAILED early-return");
    const createPos = mustExist("prisma.story.create(", "prisma.story.create");
    mustBeBefore(failedPos, "GENERATION_FAILED early-return", createPos, "prisma.story.create");
  });
});

// ── 8. GET /:id authentication ────────────────────────────────────────────────

describe('stories.ts — GET "/:id" authentication', () => {
  it('storiesRouter.get("/:id", …) registers authenticateToken as the first middleware', () => {
    mustExist(
      'storiesRouter.get("/:id", authenticateToken',
      'storiesRouter.get("/:id", authenticateToken must be the first arg after the route path',
    );
  });

  it('there is exactly one GET "/:id" route registration', () => {
    const matches = src.match(/storiesRouter\.get\("\/\:id"/g) ?? [];
    assert.equal(
      matches.length,
      1,
      `Expected exactly 1 storiesRouter.get("/:id") registration, found ${matches.length} — duplicate or shadow routes would bypass the auth guard`,
    );
  });

  it('GET "/:id" is not registered directly with an async handler (auth middleware would be skipped)', () => {
    mustAbsent(
      'storiesRouter.get("/:id", async',
      'GET "/:id" must not be registered without authenticateToken — found a route that skips auth',
    );
  });
});

// ── 9. GET /:id ownership enforcement ────────────────────────────────────────

describe('stories.ts — GET "/:id" ownership enforcement', () => {
  it("detail handler checks both story existence and ownership in one guard", () => {
    mustExist(
      "!story || story.userId !== userId",
      "GET /:id must guard with !story || story.userId !== userId — both missing and wrong-owner must 404",
    );
  });

  it("detail handler returns .status(404) after the ownership guard (not 403, which leaks existence)", () => {
    const detailRoutePos  = mustExist('storiesRouter.get("/:id", authenticateToken', "GET /:id route start");
    const ownerGuardPos   = findFrom("!story || story.userId !== userId", detailRoutePos);
    assert.ok(
      ownerGuardPos > detailRoutePos,
      "Ownership guard must be inside the GET /:id handler body",
    );

    const status404Pos = findFrom(".status(404)", ownerGuardPos);
    assert.ok(
      status404Pos > ownerGuardPos,
      "GET /:id must call .status(404) after the ownership guard — returning 403 would reveal story existence to unauthorized callers",
    );
  });
});

// ── 10. Public story sharing is intentionally disabled ───────────────────────

describe("stories.ts — public story sharing intentionally disabled", () => {
  it("no unauthenticated GET /:id route exists — public sharing awaits safe share-token design", () => {
    // The Phase 2B decision: all story reads require a verified JWT.
    // Public share links must use short-lived, HMAC-signed tokens and are not
    // implemented in this phase.  This test enforces that decision.
    mustExist(
      'storiesRouter.get("/:id", authenticateToken',
      'Authenticated GET /:id must exist',
    );
    mustAbsent(
      'storiesRouter.get("/:id", async',
      "No unauthenticated GET /:id handler may exist until a safe share-token design is in place",
    );
  });
});
