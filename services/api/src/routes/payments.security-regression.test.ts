/**
 * Static security regression tests for services/api/src/routes/payments.ts
 *
 * Strategy: inspect source text without importing runtime modules to avoid
 * Prisma, Express, network, env, or webhook side effects.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const PAYMENTS_PATH = path.resolve(__dirname, "payments.ts");
const INDEX_PATH = path.resolve(__dirname, "../index.ts");
const PLANS_MIDDLEWARE_PATH = path.resolve(__dirname, "../middleware/plans.middleware.ts");
const AUTH_MIDDLEWARE_PATH = path.resolve(__dirname, "../middleware/auth.middleware.ts");
const JWT_SERVICE_PATH = path.resolve(__dirname, "../services/jwt.service.ts");
const CHILDREN_ROUTE_PATH = path.resolve(__dirname, "children.ts");
const FRONTEND_CHILDREN_PAGE_PATH = path.resolve(__dirname, "../../../../apps/web/src/app/[locale]/children/page.tsx");
const FRONTEND_API_LIB_PATH = path.resolve(__dirname, "../../../../apps/web/src/lib/api.ts");
const ENV_EXAMPLE_PATH = path.resolve(__dirname, "../../../../.env.example");
const src: string = fs.readFileSync(PAYMENTS_PATH, "utf-8");
const indexSrc: string = fs.readFileSync(INDEX_PATH, "utf-8");
const plansSrc: string = fs.readFileSync(PLANS_MIDDLEWARE_PATH, "utf-8");
const authSrc: string = fs.readFileSync(AUTH_MIDDLEWARE_PATH, "utf-8");
const jwtSrc: string = fs.readFileSync(JWT_SERVICE_PATH, "utf-8");
const childrenRouteSrc: string = fs.readFileSync(CHILDREN_ROUTE_PATH, "utf-8");
const frontendChildrenPageSrc: string = fs.readFileSync(FRONTEND_CHILDREN_PAGE_PATH, "utf-8");
const frontendApiLibSrc: string = fs.readFileSync(FRONTEND_API_LIB_PATH, "utf-8");
const envExampleSrc: string = fs.readFileSync(ENV_EXAMPLE_PATH, "utf-8");
const mojibakeMarkers = [
  { label: "U+00D8", value: "\u00d8" },
  { label: "U+00D9", value: "\u00d9" },
  { label: "U+00E2+U+2020 prefix", value: "\u00e2\u2020" },
] as const;
const sourceHygieneMojibakeMarkers = [
  { label: "U+00E2", value: "\u00e2" },
  { label: "U+00C2", value: "\u00c2" },
  { label: "U+00C3", value: "\u00c3" },
  { label: "U+00D8", value: "\u00d8" },
  { label: "U+00D9", value: "\u00d9" },
] as const;

function find(pattern: string | RegExp): number {
  if (typeof pattern === "string") return src.indexOf(pattern);
  const m = src.match(pattern);
  return m?.index ?? -1;
}

function findFrom(needle: string, startIdx: number): number {
  return src.indexOf(needle, startIdx);
}

function mustExist(pattern: string | RegExp, label: string): number {
  const idx = find(pattern);
  assert.ok(idx >= 0, `MISSING — ${label}\n  pattern: ${pattern}`);
  return idx;
}

function mustAbsent(pattern: string | RegExp, label: string): void {
  const idx = find(pattern);
  assert.ok(idx === -1, `UNEXPECTED — ${label}\n  pattern: ${pattern}\n  found at char ${idx}`);
}

function mustBeBefore(aIdx: number, aLabel: string, bIdx: number, bLabel: string): void {
  assert.ok(
    aIdx >= 0 && bIdx >= 0 && aIdx < bIdx,
    `ORDER VIOLATION — "${aLabel}" (pos ${aIdx}) must appear before "${bLabel}" (pos ${bIdx})`,
  );
}

function assertNoMojibakeMarkers(source: string, sourceLabel: string): void {
  for (const marker of mojibakeMarkers) {
    assert.equal(
      source.includes(marker.value),
      false,
      `${sourceLabel} must not contain mojibake marker ${marker.label}`,
    );
  }
}

function assertNoSourceHygieneMojibakeMarkers(source: string, sourceLabel: string): void {
  for (const marker of sourceHygieneMojibakeMarkers) {
    assert.equal(
      source.includes(marker.value),
      false,
      `${sourceLabel} must not contain mojibake marker ${marker.label}`,
    );
  }
}

describe('payments.ts — checkout route protections', () => {
  it('registers protected POST "/checkout" with authenticateToken', () => {
    mustExist(
      /paymentsRouter\.post\(\s*"\/checkout"\s*,\s*authenticateToken\s*,/m,
      'paymentsRouter.post("/checkout", authenticateToken, ...)',
    );
  });

  it("CheckoutSchema requires positive integer variantId", () => {
    mustExist(
      /const\s+CheckoutSchema\s*=\s*z\.object\(\s*\{\s*variantId:\s*z\.number\(\)\.int\(\)\.positive\(\)\s*,?\s*\}\s*\)/m,
      "CheckoutSchema with variantId: z.number().int().positive()",
    );
  });

  it("validates allowed variant before createCheckoutUrl and keeps stable error code", () => {
    const allowedCheckPos = mustExist(
      "isAllowedCheckoutVariantId(variantId)",
      "allowed variant check",
    );
    const unknownErrPos = mustExist(
      "UNKNOWN_CHECKOUT_VARIANT",
      "stable UNKNOWN_CHECKOUT_VARIANT error code",
    );
    const checkoutCallPos = mustExist("createCheckoutUrl(", "createCheckoutUrl call");

    mustBeBefore(allowedCheckPos, "allowed variant check", checkoutCallPos, "createCheckoutUrl");
    mustBeBefore(unknownErrPos, "UNKNOWN_CHECKOUT_VARIANT", checkoutCallPos, "createCheckoutUrl");
  });

  it("uses centralized payments gate and blocks checkout with stable disabled errors", () => {
    const gateCallPos = mustExist(
      "resolvePaymentsGateDecision()",
      "resolvePaymentsGateDecision gate call",
    );
    const disabledErrPos = mustExist("PAYMENTS_DISABLED", "stable PAYMENTS_DISABLED error code");
    const notApprovedErrPos = mustExist("PROVIDER_NOT_APPROVED", "stable PROVIDER_NOT_APPROVED error code");
    const checkoutCallPos = mustExist("createCheckoutUrl(", "createCheckoutUrl call");

    mustBeBefore(gateCallPos, "resolvePaymentsGateDecision()", checkoutCallPos, "createCheckoutUrl");
    mustBeBefore(disabledErrPos, "PAYMENTS_DISABLED", checkoutCallPos, "createCheckoutUrl");
    mustBeBefore(notApprovedErrPos, "PROVIDER_NOT_APPROVED", checkoutCallPos, "createCheckoutUrl");
  });

  it("uses FRONTEND_URL guardrail helper with production misconfiguration error", () => {
    mustExist("function getCheckoutFrontendUrl()", "getCheckoutFrontendUrl helper");
    mustExist(
      "process.env.NODE_ENV === \"production\"",
      "production guard in checkout frontend URL helper",
    );
    mustExist("FRONTEND_URL_NOT_CONFIGURED", "stable FRONTEND_URL_NOT_CONFIGURED error code");
    mustExist(
      "http://localhost:3000",
      "non-production localhost fallback remains for checkout redirect",
    );
    mustAbsent(
      "process.env.FRONTEND_URL ?? \"http://localhost:3000\"",
      "legacy direct FRONTEND_URL localhost fallback expression must be absent",
    );
  });
});

describe("payments.ts — public payments status route", () => {
  it('registers GET "/status" without authenticateToken and returns canStartCheckout', () => {
    const statusRoutePos = mustExist(
      /paymentsRouter\.get\(\s*"\/status"\s*,\s*\(_req:\s*Request,\s*res:\s*Response\)\s*=>/m,
      'paymentsRouter.get("/status", ...)',
    );
    const statusSlice = src.slice(statusRoutePos, statusRoutePos + 260);
    assert.equal(
      statusSlice.includes("authenticateToken"),
      false,
      "status route must not require authenticateToken",
    );
    assert.equal(
      src.includes("canStartCheckout"),
      true,
      'status route response must include "canStartCheckout"',
    );
  });
});

describe("payments.ts — subscription/cancel route protections", () => {
  it('registers protected GET "/subscription"', () => {
    mustExist(
      /paymentsRouter\.get\(\s*"\/subscription"\s*,\s*authenticateToken\s*,/m,
      'paymentsRouter.get("/subscription", authenticateToken, ...)',
    );
  });

  it('registers protected POST "/cancel"', () => {
    mustExist(
      /paymentsRouter\.post\(\s*"\/cancel"\s*,\s*authenticateToken\s*,/m,
      'paymentsRouter.post("/cancel", authenticateToken, ...)',
    );
  });

  it("keeps cancel call and stable NO_ACTIVE_SUBSCRIPTION error", () => {
    mustExist(
      "cancelSubscription(subscription.stripeSubscriptionId)",
      "cancelSubscription call with legacy stripeSubscriptionId field",
    );
    mustExist("NO_ACTIVE_SUBSCRIPTION", "stable NO_ACTIVE_SUBSCRIPTION error code");
  });
});

describe("payments.ts — webhook route protections", () => {
  it('registers POST "/webhook" without authenticateToken', () => {
    const webhookStart = mustExist(
      /paymentsRouter\.post\(\s*"\/webhook"\s*,\s*async\s*\(req:\s*Request,\s*res:\s*Response\)\s*=>/m,
      'paymentsRouter.post("/webhook", async ...)',
    );
    const webhookHeaderSlice = src.slice(webhookStart, webhookStart + 220);
    assert.equal(
      webhookHeaderSlice.includes("authenticateToken"),
      false,
      "webhook route must not include authenticateToken",
    );
  });

  it("verifies signature before JSON parsing and handler execution", () => {
    const verifyPos = mustExist(
      "verifyLemonSqueezyWebhook(raw, signature)",
      "verifyLemonSqueezyWebhook(raw, signature)",
    );
    const invalidSigPos = mustExist(
      'res.status(401).json({ error: "Invalid signature" })',
      "401 invalid signature response",
    );
    const parsePos = mustExist("JSON.parse(raw.toString(\"utf8\"))", "event JSON parse");
    const handlerPos = mustExist(
      "handleLemonSubscriptionEvent(eventName, event)",
      "handle webhook event call",
    );

    mustBeBefore(verifyPos, "signature verification", invalidSigPos, "invalid signature response");
    mustBeBefore(invalidSigPos, "invalid signature response", parsePos, "JSON.parse");
    mustBeBefore(parsePos, "JSON.parse", handlerPos, "handleLemonSubscriptionEvent");
  });

  it("keeps stable Missing event_name validation before handler", () => {
    const eventNameCheckPos = mustExist("if (!eventName)", "eventName presence check");
    const missingEventErrPos = mustExist(
      'res.status(400).json({ error: "Missing event_name" })',
      "Missing event_name response",
    );
    const handlerPos = mustExist(
      "handleLemonSubscriptionEvent(eventName, event)",
      "handle webhook event call",
    );
    mustBeBefore(eventNameCheckPos, "if (!eventName)", missingEventErrPos, "Missing event_name error");
    mustBeBefore(missingEventErrPos, "Missing event_name error", handlerPos, "event handler call");
  });
});

describe("payments.ts — webhook subscription policy protections", () => {
  it("keeps subscription_payment_success as notification-only early return", () => {
    const paymentSuccessPos = mustExist(
      'if (eventName === "subscription_payment_success")',
      "subscription_payment_success branch",
    );
    const paymentReturnPos = findFrom("return;", paymentSuccessPos);
    const userUpdatePos = mustExist("prisma.user.update(", "prisma.user.update call");
    assert.ok(paymentReturnPos > paymentSuccessPos, "subscription_payment_success branch must return");
    mustBeBefore(paymentReturnPos, "subscription_payment_success return", userUpdatePos, "prisma.user.update");
  });

  it("keeps cancellation/expiration branch setting User.plan to FREE", () => {
    const cancelBranchPos = mustExist(
      /eventName === "subscription_cancelled"\s*\|\|\s*eventName === "subscription_expired"/m,
      "subscription_cancelled/subscription_expired branch",
    );
    const freePlanUpdatePos = findFrom('data: { plan: "FREE" }', cancelBranchPos);
    assert.ok(
      freePlanUpdatePos > cancelBranchPos,
      'cancel/expired branch must update user plan to "FREE"',
    );
  });

  it("keeps unknown variant guard with resolvePlanFromLemonVariantId and early return", () => {
    const resolvePlanPos = mustExist(
      "resolvePlanFromLemonVariantId(variantId)",
      "resolve plan from variant",
    );
    const unknownGuardPos = mustExist("if (!plan)", "unknown plan guard");
    const unknownWarnPos = mustExist("unknown variant_id=", "unknown variant warning");
    const unknownReturnPos = findFrom("return;", unknownGuardPos);
    const effectivePlanPos = mustExist(
      "resolveEffectiveUserPlanForSubscription(plan, status)",
      "effective plan resolution",
    );

    mustBeBefore(resolvePlanPos, "resolvePlanFromLemonVariantId", unknownGuardPos, "if (!plan)");
    mustBeBefore(unknownGuardPos, "if (!plan)", unknownWarnPos, "unknown variant warning");
    assert.ok(unknownReturnPos > unknownGuardPos, "unknown variant guard must return early");
    mustBeBefore(
      unknownReturnPos,
      "unknown variant return",
      effectivePlanPos,
      "resolveEffectiveUserPlanForSubscription",
    );
  });

  it("uses effective entitlement for User.plan and catalog plan for Subscription.plan", () => {
    mustExist(
      "resolveEffectiveUserPlanForSubscription(plan, status)",
      "effective user plan resolver usage",
    );
    mustExist(
      "data: { plan: effectiveUserPlan, stripeId:",
      "prisma.user.update uses effectiveUserPlan",
    );
    mustExist(
      /prisma\.subscription\.upsert\([\s\S]*create:\s*\{[\s\S]*plan,\s*[\s\S]*update:\s*\{[\s\S]*plan,/m,
      "prisma.subscription.upsert stores catalog plan in create/update",
    );
  });
});

describe("payments.ts — mapping implementation guardrails", () => {
  it("uses mapLemonSubscriptionStatus from billing helper", () => {
    mustExist(
      /import\s*\{[\s\S]*mapLemonSubscriptionStatus[\s\S]*resolvePaymentsGateDecision[\s\S]*\}\s*from\s*"..\/config\/billing"/m,
      "mapLemonSubscriptionStatus billing import",
    );
    mustExist(
      "mapLemonSubscriptionStatus(String(attrs?.status ?? \"\"))",
      "mapLemonSubscriptionStatus usage",
    );
  });

  it("does not reintroduce local planFromVariantId or mapLemonStatus helpers", () => {
    mustAbsent(
      /function\s+planFromVariantId\s*\(/m,
      "local planFromVariantId function must remain absent",
    );
    mustAbsent(
      /function\s+mapLemonStatus\s*\(/m,
      "local mapLemonStatus function must remain absent",
    );
  });
});

describe("index.ts — webhook raw parser ordering", () => {
  it("mounts /api/payments/webhook with express.raw before express.json", () => {
    const webhookRawPos = indexSrc.indexOf('"/api/payments/webhook"');
    const rawParserPos = indexSrc.indexOf('express.raw({ type: "application/json" })');
    const jsonParserPos = indexSrc.indexOf("app.use(express.json())");
    assert.ok(webhookRawPos >= 0, "index.ts must mount /api/payments/webhook parser");
    assert.ok(rawParserPos >= 0, "index.ts must use express.raw for webhook route");
    assert.ok(jsonParserPos >= 0, "index.ts must include global express.json parser");
    assert.ok(rawParserPos < jsonParserPos, "webhook express.raw must be mounted before express.json");
  });
});

describe("index.ts — CORS allowed origins guardrails", () => {
  it("supports ALLOWED_ORIGINS env parsing with fallback defaults", () => {
    assert.ok(
      indexSrc.includes("process.env.ALLOWED_ORIGINS"),
      "index.ts must reference process.env.ALLOWED_ORIGINS",
    );
    assert.ok(indexSrc.includes("function parseAllowedOrigins"), "index.ts must define parseAllowedOrigins");
    assert.ok(indexSrc.includes("const allowedOrigins"), "index.ts must compute allowedOrigins");
    assert.ok(
      indexSrc.includes("origin: allowedOrigins"),
      "cors config must use computed allowedOrigins",
    );
  });

  it("keeps default CORS origins including localhost and known production domains", () => {
    assert.ok(
      indexSrc.includes("http://localhost:3000"),
      "default CORS origins must include localhost",
    );
    assert.ok(indexSrc.includes("https://dreemi.app"), "default CORS origins must include https://dreemi.app");
    assert.ok(
      indexSrc.includes("https://www.dreemi.app"),
      "default CORS origins must include https://www.dreemi.app",
    );
    assert.ok(
      indexSrc.includes("https://dreemi-app-web.vercel.app"),
      "default CORS origins must include https://dreemi-app-web.vercel.app",
    );
  });
});

describe("plan/children limits alignment regressions", () => {
  it("keeps backend FREE monthly story limit at 3", () => {
    assert.ok(
      plansSrc.includes("const FREE_MONTHLY_LIMIT = 3;"),
      "plans.middleware.ts must keep FREE_MONTHLY_LIMIT = 3",
    );
  });

  it("keeps backend children SCHOOL limit as Infinity", () => {
    assert.ok(
      childrenRouteSrc.includes("SCHOOL: Infinity"),
      "children.ts must keep SCHOOL: Infinity in CHILD_LIMITS",
    );
  });

  it("keeps frontend children SCHOOL limit aligned to Infinity (not 999)", () => {
    assert.ok(
      frontendChildrenPageSrc.includes("SCHOOL: Infinity"),
      "frontend children page must use SCHOOL: Infinity",
    );
    assert.equal(
      frontendChildrenPageSrc.includes("SCHOOL: 999"),
      false,
      "frontend children page must not use SCHOOL: 999",
    );
  });

  it("ensures plans.middleware.ts has no mojibake markers", () => {
    assertNoMojibakeMarkers(plansSrc, "plans.middleware.ts");
  });
});

describe("auth/jwt/plans Arabic mojibake regressions", () => {
  it("ensures auth.middleware.ts has no mojibake markers and keeps expected Arabic messages", () => {
    assertNoMojibakeMarkers(authSrc, "auth.middleware.ts");
    assert.ok(authSrc.includes("رمز الوصول مطلوب"), 'auth.middleware.ts must include "رمز الوصول مطلوب"');
    assert.ok(authSrc.includes("خطأ في إعداد الخادم"), 'auth.middleware.ts must include "خطأ في إعداد الخادم"');
    assert.ok(
      authSrc.includes("رمز الوصول غير صالح أو منتهي الصلاحية"),
      'auth.middleware.ts must include "رمز الوصول غير صالح أو منتهي الصلاحية"',
    );
  });

  it("ensures jwt.service.ts has no mojibake markers and keeps expected Arabic messages", () => {
    assertNoMojibakeMarkers(jwtSrc, "jwt.service.ts");
    assert.ok(jwtSrc.includes("JWT_SECRET غير معرّف"), 'jwt.service.ts must include "JWT_SECRET غير معرّف"');
    assert.ok(
      jwtSrc.includes("JWT_REFRESH_SECRET غير معرّف"),
      'jwt.service.ts must include "JWT_REFRESH_SECRET غير معرّف"',
    );
    assert.ok(jwtSrc.includes("رمز غير صالح"), 'jwt.service.ts must include "رمز غير صالح"');
  });

  it("ensures plans.middleware.ts keeps expected Arabic messages and readable comment", () => {
    assert.ok(
      plansSrc.includes("FREE → max 3 stories/month. INDIVIDUAL / FAMILY / SCHOOL → unlimited."),
      "plans.middleware.ts must keep readable FREE/paid limit comment",
    );
    assert.ok(plansSrc.includes("رمز الوصول مطلوب"), 'plans.middleware.ts must include "رمز الوصول مطلوب"');
    assert.ok(plansSrc.includes("المستخدم غير موجود"), 'plans.middleware.ts must include "المستخدم غير موجود"');
    assert.ok(
      plansSrc.includes("وصلت للحد الأقصى (${FREE_MONTHLY_LIMIT} قصص/شهر). قم بالترقية لقصص غير محدودة."),
      "plans.middleware.ts must include the readable Arabic story-limit message",
    );
    assert.ok(plansSrc.includes("خطأ في التحقق من الخطة"), 'plans.middleware.ts must include "خطأ في التحقق من الخطة"');
  });
});

describe("frontend api URL production guard regressions", () => {
  it("keeps NEXT_PUBLIC_API_URL guard with production failure and local fallback", () => {
    const legacyOnrenderApiFallback = ["https://dreemi-app", "onrender.com"].join(".");

    assert.ok(
      frontendApiLibSrc.includes("process.env.NEXT_PUBLIC_API_URL"),
      "api.ts must reference process.env.NEXT_PUBLIC_API_URL",
    );
    assert.equal(
      frontendApiLibSrc.includes(legacyOnrenderApiFallback),
      false,
      "api.ts must not include legacy onrender fallback",
    );
    assert.ok(
      frontendApiLibSrc.includes("NEXT_PUBLIC_API_URL is not configured"),
      "api.ts must include clear production misconfiguration error",
    );
    assert.ok(
      frontendApiLibSrc.includes("http://localhost:3001"),
      "api.ts must keep non-production localhost fallback",
    );
    assert.ok(
      frontendApiLibSrc.includes('process.env.NODE_ENV === "production"'),
      "api.ts must include production guard",
    );
  });
});

describe("targeted source hygiene regressions", () => {
  it("keeps targeted sources free of mojibake-prone markers", () => {
    assertNoSourceHygieneMojibakeMarkers(frontendApiLibSrc, "apps/web/src/lib/api.ts");
    assertNoSourceHygieneMojibakeMarkers(src, "services/api/src/routes/payments.ts");
  });
});

describe(".env.example production alignment guards", () => {
  it("includes ALLOWED_ORIGINS placeholder", () => {
    assert.ok(
      envExampleSrc.includes("ALLOWED_ORIGINS="),
      ".env.example must include ALLOWED_ORIGINS placeholder",
    );
  });
});
