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
import { generateStoryImage } from "../services/image.service";

// ── Load source once ─────────────────────────────────────────────────────────

const STORIES_PATH = path.resolve(__dirname, "stories.ts");
const src: string = fs.readFileSync(STORIES_PATH, "utf-8");
const PLANS_MIDDLEWARE_PATH = path.resolve(__dirname, "../middleware/plans.middleware.ts");
const CHILDREN_ROUTE_PATH = path.resolve(__dirname, "children.ts");
const PAYMENTS_ROUTE_PATH = path.resolve(__dirname, "payments.ts");
const IMAGE_SERVICE_PATH = path.resolve(__dirname, "../services/image.service.ts");
const STORY_DETAIL_PAGE_PATH = path.resolve(
  __dirname,
  "../../../../apps/web/src/app/[locale]/story/[id]/page.tsx",
);
const STORY_CARD_PATH = path.resolve(
  __dirname,
  "../../../../apps/web/src/components/StoryCard.tsx",
);
const GENERATE_PAGE_PATH = path.resolve(
  __dirname,
  "../../../../apps/web/src/app/[locale]/generate/page.tsx",
);
const PDF_EXPORT_PATH = path.resolve(
  __dirname,
  "../../../../apps/web/src/lib/exportStoryPdf.ts",
);
const plansSrc: string = fs.readFileSync(PLANS_MIDDLEWARE_PATH, "utf-8");
const childrenSrc: string = fs.readFileSync(CHILDREN_ROUTE_PATH, "utf-8");
const paymentsSrc: string = fs.readFileSync(PAYMENTS_ROUTE_PATH, "utf-8");
const imageServiceSrc: string = fs.readFileSync(IMAGE_SERVICE_PATH, "utf-8");
const storyDetailSrc: string = fs.readFileSync(STORY_DETAIL_PAGE_PATH, "utf-8");
const storyCardSrc: string = fs.readFileSync(STORY_CARD_PATH, "utf-8");
const generatePageSrc: string = fs.readFileSync(GENERATE_PAGE_PATH, "utf-8");
const pdfExportSrc: string = fs.readFileSync(PDF_EXPORT_PATH, "utf-8");

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

// ── 4B. D3K story-limit baseline lock (middleware source of truth) ───────────

describe("plans.middleware.ts — D3K story-limit baseline lock", () => {
  it("keeps checkStoryLimit defined in plans middleware", () => {
    assert.match(
      plansSrc,
      /export\s+async\s+function\s+checkStoryLimit\s*\(/,
      "checkStoryLimit must remain defined in plans.middleware.ts for D3K baseline",
    );
  });

  it("wires plans.middleware.ts through EntitlementService compatibility projection", () => {
    assert.match(
      plansSrc,
      /import\s*\{\s*createEntitlementService\s*\}\s*from\s*"..\/services\/entitlement\.service"/,
      "plans.middleware.ts must import createEntitlementService in D3K",
    );
    assert.match(
      plansSrc,
      /const\s+entitlementService\s*=\s*createEntitlementService\(\)\s*;/,
      "plans.middleware.ts must initialize module-level EntitlementService in D3K",
    );
    assert.match(
      plansSrc,
      /getPlanForAccessCheck\(\s*userId,\s*user\.plan\s*\)/,
      "plans.middleware.ts must call getPlanForAccessCheck(userId, user.plan) in D3K",
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
      /if\s*\(\s*accessPlan\s*!==\s*"FREE"\s*\)\s*\{[\s\S]*next\(\);[\s\S]*return;[\s\S]*\}/,
      "non-FREE bypass must remain via projected accessPlan in D3K",
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

  it("does not read provider-specific ids or payment runtime state", () => {
    const providerIdPolicyTokens =
      /variantId|variant_id|productId|product_id|LEMON_VARIANT|stripePriceId|PAYMENT_ACTIVE_PROVIDER|resolvePlanFromLemonVariantId|resolveEffectiveUserPlanForSubscription/;
    assert.equal(
      providerIdPolicyTokens.test(plansSrc),
      false,
      "plans.middleware.ts must stay provider-neutral for access policy",
    );
  });
});

// ── 4C. D3K runtime wiring scope lock for runtime surfaces ────────────────────

describe("D3K runtime wiring scope lock for story-generation surface", () => {
  it("requires plans.middleware.ts wiring to EntitlementService in D3K", () => {
    assert.equal(
      /EntitlementService|createEntitlementService|entitlement\.service|getEffectiveEntitlement|getPlanForAccessCheck|canGenerateStory|getChildLimit/.test(
        plansSrc,
      ),
      true,
      "plans.middleware.ts must be wired in D3K",
    );
  });

  it("keeps stories.ts non-wired to EntitlementService pre-D3K", () => {
    assert.equal(
      /EntitlementService|createEntitlementService|entitlement\.service|getEffectiveEntitlement|getPlanForAccessCheck|canGenerateStory|getChildLimit/.test(
        src,
      ),
      false,
      "stories.ts must remain non-wired directly in D3K",
    );
  });

  it("keeps payments.ts non-wired to EntitlementService pre-D3K", () => {
    assert.equal(
      /EntitlementService|createEntitlementService|entitlement\.service|getEffectiveEntitlement|getPlanForAccessCheck|canGenerateStory|getChildLimit/.test(
        paymentsSrc,
      ),
      false,
      "payments.ts must remain non-wired in D3K",
    );
  });

  it("allows EntitlementService runtime references only in children.ts and plans.middleware.ts", () => {
    const entitlementSurfacePattern =
      /EntitlementService|createEntitlementService|entitlement\.service|getEffectiveEntitlement|getPlanForAccessCheck|canGenerateStory|getChildLimit/;
    assert.equal(entitlementSurfacePattern.test(childrenSrc), true);
    assert.equal(entitlementSurfacePattern.test(src), false);
    assert.equal(entitlementSurfacePattern.test(plansSrc), true);
    assert.equal(entitlementSurfacePattern.test(paymentsSrc), false);
  });

  it("keeps D3G child-limit entitlement call unchanged", () => {
    assert.match(childrenSrc, /createEntitlementService/);
    assert.match(childrenSrc, /getChildLimit\(\s*userId,\s*user\.plan\s*\)/);
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

// ── 11. Image service no-provider behavior ────────────────────────────────────

type FetchMock = (typeof globalThis.fetch);

function mockFetch(impl: FetchMock): () => void {
  const original = globalThis.fetch;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).fetch = impl;
  return () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).fetch = original;
  };
}

function baseImageReq() {
  return {
    childName: "Test Child",
    childAge: 6,
    theme: "stars",
    storyTitle: "Star Night",
    storyContent: "A calm bedtime walk under shining stars.",
  };
}

function mockResponse(ok: boolean, contentType: string | null): Response {
  return {
    ok,
    headers: {
      get(name: string): string | null {
        if (name.toLowerCase() !== "content-type") return null;
        return contentType;
      },
    },
    body: {
      cancel: async () => {},
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any as Response;
}

describe("image.service.ts — no-provider generateStoryImage guardrails", () => {
  it("returns null when fetch throws (provider failure fallback)", async () => {
    const restore = mockFetch(async () => {
      throw new Error("network down");
    });
    try {
      const result = await generateStoryImage(baseImageReq());
      assert.equal(result, null);
    } finally {
      restore();
    }
  });

  it("returns null when response is not ok", async () => {
    const restore = mockFetch(async () => mockResponse(false, "image/png"));
    try {
      const result = await generateStoryImage(baseImageReq());
      assert.equal(result, null);
    } finally {
      restore();
    }
  });

  it("returns null when content-type is not image/*", async () => {
    const restore = mockFetch(async () => mockResponse(true, "application/json"));
    try {
      const result = await generateStoryImage(baseImageReq());
      assert.equal(result, null);
    } finally {
      restore();
    }
  });

  it("returns null for invalid response shape (missing content-type)", async () => {
    const restore = mockFetch(async () => mockResponse(true, null));
    try {
      const result = await generateStoryImage(baseImageReq());
      assert.equal(result, null);
    } finally {
      restore();
    }
  });

  it("returns a pollinations URL only after verification succeeds", async () => {
    const restore = mockFetch(async (input) => {
      const url = String(input);
      assert.match(url, /^https:\/\/image\.pollinations\.ai\/prompt\//);
      return mockResponse(true, "image/png");
    });
    try {
      const result = await generateStoryImage(baseImageReq());
      assert.ok(typeof result === "string");
      assert.match(result!, /^https:\/\/image\.pollinations\.ai\/prompt\//);
    } finally {
      restore();
    }
  });

  it("passes AbortSignal to fetch (timeout/abort plumbing exists)", async () => {
    const restore = mockFetch(async (_input, init) => {
      assert.ok(init && typeof init === "object");
      assert.ok(init?.signal instanceof AbortSignal);
      return mockResponse(true, "image/png");
    });
    try {
      const result = await generateStoryImage(baseImageReq());
      assert.ok(typeof result === "string");
    } finally {
      restore();
    }
  });
});

// ── 12. stories.ts async image update contract ────────────────────────────────

describe("stories.ts — async image update non-blocking contract", () => {
  it("creates story with imageUrl null before async image generation", () => {
    const createPos = mustExist("prisma.story.create(", "story create call");
    const imageNullPos = mustExist("imageUrl: null", "create uses imageUrl null");
    const generateImagePos = mustExist("generateStoryImage({", "async image generation call");
    mustBeBefore(createPos, "prisma.story.create", generateImagePos, "generateStoryImage");
    mustBeBefore(imageNullPos, "imageUrl: null", generateImagePos, "generateStoryImage");
  });

  it("returns 201 response before async image generation call", () => {
    const responsePos = mustExist('res.status(201).json({ success: true, story });', "201 response");
    const generateImagePos = mustExist("generateStoryImage({", "async image generation call");
    mustBeBefore(responsePos, "res.status(201).json", generateImagePos, "generateStoryImage");
  });

  it("keeps async image update in then/catch non-blocking branch", () => {
    const generatePos = mustExist("generateStoryImage({", "generateStoryImage");
    const thenPos = findFrom("}).then(async (imageUrl) => {", generatePos);
    const catchPos = findFrom("}).catch((err: unknown) => {", generatePos);
    assert.ok(thenPos > generatePos, "generateStoryImage must continue in then branch");
    assert.ok(catchPos > thenPos, "then branch must be followed by catch branch");
    mustExist('console.error("[Stories] image failed:"', "image failure catch logging exists");
  });

  it("does not call Pollinations directly in stories route (provider boundary stays in image service)", () => {
    mustAbsent(/pollinations\.ai/i, "stories.ts must not include direct Pollinations URL");
    mustAbsent(/https:\/\/image\.pollinations\.ai/i, "stories.ts must not hardcode provider endpoint");
  });
});

// ── 13. image.service static privacy/logging guardrails ───────────────────────

describe("image.service.ts — static guardrails", () => {
  it("contains timeout, AbortController, and image content-type checks", () => {
    assert.match(imageServiceSrc, /IMAGE_VERIFY_TIMEOUT_MS\s*=\s*15_000/);
    assert.match(imageServiceSrc, /new\s+AbortController\(\)/);
    assert.match(imageServiceSrc, /controller\.abort\(\)/);
    assert.match(imageServiceSrc, /ct\.startsWith\("image\/"\)/);
  });

  it("returns safe null fallback on verification or generation failure", () => {
    assert.match(imageServiceSrc, /if\s*\(!verified\)\s*\{[\s\S]*return null;[\s\S]*\}/);
    assert.match(imageServiceSrc, /catch\s*\{[\s\S]*return null;[\s\S]*\}/);
  });

  it("does not log full prompt contents directly", () => {
    assert.equal(
      /console\.(log|warn|error)\([^)]*\bprompt\b/i.test(imageServiceSrc),
      false,
      "image.service.ts must avoid direct prompt logging",
    );
  });
});

// ── 14. Frontend and PDF fallback static coverage ─────────────────────────────

describe("frontend/pdf image fallback static guardrails", () => {
  it("StoryCard keeps image onError fallback", () => {
    assert.match(storyCardSrc, /onError=\{\(\)\s*=>\s*setImgError\(true\)\}/);
    assert.match(storyCardSrc, /\{story\.imageUrl && !imgError \?/);
  });

  it("story detail page keeps image onError fallback", () => {
    assert.match(storyDetailSrc, /onError=\{\(\)\s*=>\s*setImgError\(true\)\}/);
    assert.match(storyDetailSrc, /\{story\.imageUrl && !imgError \?/);
  });

  it("PDF export keeps timeout and fallback box rendering path", () => {
    assert.match(pdfExportSrc, /IMG_LOAD_TIMEOUT_MS\s*=\s*10_000/);
    assert.match(pdfExportSrc, /drawImageFallback/);
    assert.match(pdfExportSrc, /Story illustration unavailable/);
  });

  it("generate page keeps explicit image onError fallback with localized fallback branch", () => {
    assert.match(generatePageSrc, /\{story\.imageUrl && !imgError \?/);
    assert.match(generatePageSrc, /onError=\{\(\)\s*=>\s*setImgError\(true\)\}/);
    assert.match(generatePageSrc, /storyIllustrationUnavailable/);
    assert.match(generatePageSrc, /setImgError\(false\)/);
  });
});
