import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createEntitlementService } from "./entitlement.service";

const SERVICE_PATH = path.resolve(__dirname, "entitlement.service.ts");
const PAYMENTS_ROUTE_PATH = path.resolve(__dirname, "../routes/payments.ts");
const CHILDREN_ROUTE_PATH = path.resolve(__dirname, "../routes/children.ts");
const STORIES_ROUTE_PATH = path.resolve(__dirname, "../routes/stories.ts");
const PLANS_MIDDLEWARE_PATH = path.resolve(__dirname, "../middleware/plans.middleware.ts");
const PRISMA_SCHEMA_PATH = path.resolve(__dirname, "../../../../prisma/schema.prisma");
const serviceSource = fs.readFileSync(SERVICE_PATH, "utf-8");
const paymentsRouteSource = fs.readFileSync(PAYMENTS_ROUTE_PATH, "utf-8");
const childrenRouteSource = fs.readFileSync(CHILDREN_ROUTE_PATH, "utf-8");
const storiesRouteSource = fs.readFileSync(STORIES_ROUTE_PATH, "utf-8");
const plansMiddlewareSource = fs.readFileSync(PLANS_MIDDLEWARE_PATH, "utf-8");
const prismaSchemaSource = fs.readFileSync(PRISMA_SCHEMA_PATH, "utf-8");

describe("EntitlementService user-plan read model", () => {
  it("FREE plan resolves to FREE effective entitlement", async () => {
    const service = createEntitlementService();
    const effective = await service.getEffectiveEntitlement("user_123", "FREE");
    assert.equal(effective.plan, "FREE");
    assert.equal(effective.projectedUserPlan, "FREE");
    assert.equal(effective.grantsPaidAccess, false);
    assert.equal(effective.status, "none");
  });

  it("INDIVIDUAL plan resolves to expected effective entitlement", async () => {
    const service = createEntitlementService();
    const effective = await service.getEffectiveEntitlement("user_123", "INDIVIDUAL");
    assert.equal(effective.plan, "INDIVIDUAL");
    assert.equal(effective.projectedUserPlan, "INDIVIDUAL");
    assert.equal(effective.grantsPaidAccess, true);
    assert.equal(effective.status, "active");
  });

  it("FAMILY plan resolves to expected effective entitlement", async () => {
    const service = createEntitlementService();
    const effective = await service.getEffectiveEntitlement("user_123", "FAMILY");
    assert.equal(effective.plan, "FAMILY");
    assert.equal(effective.projectedUserPlan, "FAMILY");
    assert.equal(effective.grantsPaidAccess, true);
    assert.equal(effective.status, "active");
  });

  it("SCHOOL plan resolves to expected effective entitlement", async () => {
    const service = createEntitlementService();
    const effective = await service.getEffectiveEntitlement("user_123", "SCHOOL");
    assert.equal(effective.plan, "SCHOOL");
    assert.equal(effective.projectedUserPlan, "SCHOOL");
    assert.equal(effective.grantsPaidAccess, true);
    assert.equal(effective.status, "active");
  });

  it("null, undefined, empty, and unknown plans resolve fail-closed to FREE", async () => {
    const service = createEntitlementService();
    const nullPlan = await service.getEffectiveEntitlement("user_123", null);
    const undefinedPlan = await service.getEffectiveEntitlement("user_123", undefined);
    const emptyPlan = await service.getEffectiveEntitlement("user_123", "   ");
    const unknownPlan = await service.getEffectiveEntitlement("user_123", "PRO");

    assert.equal(nullPlan.plan, "FREE");
    assert.equal(undefinedPlan.plan, "FREE");
    assert.equal(emptyPlan.plan, "FREE");
    assert.equal(unknownPlan.plan, "FREE");
    assert.equal(unknownPlan.grantsPaidAccess, false);
    assert.equal(unknownPlan.reason, "user_plan_unsupported_fail_closed_free");
  });

  it("source type stays USER_PLAN_COMPATIBILITY for plan-based resolution", async () => {
    const service = createEntitlementService();
    const effective = await service.getEffectiveEntitlement("user_123", "FAMILY");
    assert.equal(effective.sourceType, "USER_PLAN_COMPATIBILITY");
  });

  it("getPlanForAccessCheck resolves from user-plan input", async () => {
    const service = createEntitlementService();
    const plan = await service.getPlanForAccessCheck("user_123", "INDIVIDUAL");
    assert.equal(plan, "INDIVIDUAL");
  });

  it("canGenerateStory remains behavior-compatible for FREE user plan", async () => {
    const service = createEntitlementService();
    const decision = await service.canGenerateStory("user_123", "FREE");
    assert.equal(decision.allowed, true);
    assert.equal(decision.plan, "FREE");
    assert.equal(decision.safeErrorCode, null);
  });

  it("canGenerateStory remains behavior-compatible for INDIVIDUAL user plan", async () => {
    const service = createEntitlementService();
    const decision = await service.canGenerateStory("user_123", "INDIVIDUAL");
    assert.equal(decision.allowed, true);
    assert.equal(decision.plan, "INDIVIDUAL");
    assert.equal(decision.safeErrorCode, null);
  });

  it("canGenerateStory remains behavior-compatible for FAMILY user plan", async () => {
    const service = createEntitlementService();
    const decision = await service.canGenerateStory("user_123", "FAMILY");
    assert.equal(decision.allowed, true);
    assert.equal(decision.plan, "FAMILY");
    assert.equal(decision.safeErrorCode, null);
  });

  it("canGenerateStory remains behavior-compatible for SCHOOL user plan", async () => {
    const service = createEntitlementService();
    const decision = await service.canGenerateStory("user_123", "SCHOOL");
    assert.equal(decision.allowed, true);
    assert.equal(decision.plan, "SCHOOL");
    assert.equal(decision.safeErrorCode, null);
  });

  it("canGenerateStory remains fail-closed FREE for unknown or missing plans", async () => {
    const service = createEntitlementService();
    const unknownDecision = await service.canGenerateStory("user_123", "SOME_UNKNOWN_PLAN");
    const missingDecision = await service.canGenerateStory("user_123", undefined);
    const emptyDecision = await service.canGenerateStory("user_123", "   ");

    assert.equal(unknownDecision.allowed, true);
    assert.equal(missingDecision.allowed, true);
    assert.equal(emptyDecision.allowed, true);
    assert.equal(unknownDecision.plan, "FREE");
    assert.equal(missingDecision.plan, "FREE");
    assert.equal(emptyDecision.plan, "FREE");
    assert.equal(unknownDecision.safeErrorCode, null);
    assert.equal(missingDecision.safeErrorCode, null);
    assert.equal(emptyDecision.safeErrorCode, null);
  });

  it("getChildLimit uses compatibility limits from projected plan", async () => {
    const service = createEntitlementService();
    const freeDecision = await service.getChildLimit("user_123", "FREE");
    const individualDecision = await service.getChildLimit("user_123", "INDIVIDUAL");
    const familyDecision = await service.getChildLimit("user_123", "FAMILY");
    const schoolDecision = await service.getChildLimit("user_123", "SCHOOL");

    assert.equal(freeDecision.limit, 1);
    assert.equal(individualDecision.limit, 1);
    assert.equal(familyDecision.limit, 4);
    assert.equal(schoolDecision.limit, Number.POSITIVE_INFINITY);
  });

  it("project helper stays no-write and uses projected plan from effective model", async () => {
    const service = createEntitlementService();
    const effective = await service.getEffectiveEntitlement("user_123", "FAMILY");
    const projection = service.projectEffectivePlanToUser("user_123", effective);
    assert.equal(projection.projectedPlan, "FAMILY");
    assert.equal(projection.wroteToUserPlan, false);
  });

  it("no provider-specific product IDs are needed to compute access", async () => {
    const service = createEntitlementService();
    const effective = await service.getEffectiveEntitlement(
      "user_123",
      "some_provider_plan_id_123",
    );
    assert.equal(effective.plan, "FREE");
    assert.equal(effective.reason, "user_plan_unsupported_fail_closed_free");
  });

  it("read-model helper resolves deterministically from the passed user-plan", () => {
    const service = createEntitlementService();
    const first = service.getEffectiveEntitlementFromUserPlan("user_123", "FAMILY");
    const second = service.getEffectiveEntitlementFromUserPlan("user_123", "FAMILY");

    assert.equal(first.plan, "FAMILY");
    assert.equal(second.plan, "FAMILY");
    assert.equal(first.projectedUserPlan, second.projectedUserPlan);
    assert.equal(first.reason, second.reason);
  });
});

describe("EntitlementService static guardrails", () => {
  it("service file does not import routes", () => {
    assert.equal(serviceSource.includes("../routes/"), false);
  });

  it("service file does not import middleware", () => {
    assert.equal(serviceSource.includes("../middleware/"), false);
  });

  it("service file does not import payments.ts", () => {
    assert.equal(serviceSource.includes("../routes/payments"), false);
  });

  it("service file does not import Prisma client service", () => {
    const prismaServiceToken = "prisma" + ".service";
    assert.equal(serviceSource.includes(prismaServiceToken), false);
    assert.equal(serviceSource.includes("@prisma/client"), false);
  });

  it("service file does not read runtime env values", () => {
    const envToken = "process" + ".env";
    assert.equal(serviceSource.includes(envToken), false);
  });

  it("service file does not contain outbound network client calls", () => {
    const outboundTokens = ["fe" + "tch(", "axi" + "os", "undi" + "ci"];
    for (const token of outboundTokens) {
      assert.equal(serviceSource.includes(token), false);
    }
  });

  it("only children route may reference EntitlementService wiring in D3G", () => {
    const pattern =
      /entitlement\.service|createEntitlementService|EntitlementService|getEffectiveEntitlement|getPlanForAccessCheck|canGenerateStory|getChildLimit/;
    assert.equal(pattern.test(childrenRouteSource), true);
    assert.equal(pattern.test(paymentsRouteSource), false);
    assert.equal(pattern.test(storiesRouteSource), false);
    assert.equal(pattern.test(plansMiddlewareSource), false);
  });

  it("current prisma schema remains on existing Plan enum without entitlement models", () => {
    assert.equal(prismaSchemaSource.includes("enum Plan"), true);
    assert.equal(prismaSchemaSource.includes("INDIVIDUAL"), true);
    assert.equal(prismaSchemaSource.includes("FAMILY"), true);
    assert.equal(prismaSchemaSource.includes("SCHOOL"), true);
    assert.equal(prismaSchemaSource.includes("model Entitlement"), false);
  });
});

describe("EntitlementService runtime wiring guardrails (D3G)", () => {
  it("only children route imports/calls EntitlementService; stories/plans/payments remain untouched", () => {
    const entitlementTokens =
      /entitlement\.service|createEntitlementService|EntitlementService|getEffectiveEntitlement|getPlanForAccessCheck|canGenerateStory|getChildLimit/;
    assert.equal(entitlementTokens.test(plansMiddlewareSource), false);
    assert.equal(entitlementTokens.test(storiesRouteSource), false);
    assert.equal(entitlementTokens.test(childrenRouteSource), true);
    assert.equal(entitlementTokens.test(paymentsRouteSource), false);
  });

  it("plans middleware keeps legacy User.plan read and FREE monthly limit enforcement", () => {
    assert.match(plansMiddlewareSource, /const\s+FREE_MONTHLY_LIMIT\s*=\s*3\s*;/);
    assert.match(plansMiddlewareSource, /select:\s*\{\s*plan:\s*true\s*\}/);
    assert.match(plansMiddlewareSource, /if\s*\(\s*user\.plan\s*!==\s*"FREE"\s*\)/);
    assert.match(plansMiddlewareSource, /count\s*>=\s*FREE_MONTHLY_LIMIT/);
  });

  it("stories route keeps checkStoryLimit in POST /generate middleware order", () => {
    assert.match(
      storiesRouteSource,
      /storiesRouter\.post\(\s*"\/generate",[\s\S]*authenticateToken,[\s\S]*generateRateLimit,[\s\S]*checkStoryLimit,[\s\S]*async\s*\(/,
    );
  });

  it("children route wires child-limit decision through EntitlementService and keeps legacy inputs", () => {
    assert.match(childrenRouteSource, /createEntitlementService/);
    assert.match(childrenRouteSource, /getChildLimit\(\s*userId,\s*user\.plan\s*\)/);
    assert.match(childrenRouteSource, /select:\s*\{\s*plan:\s*true\s*\}/);
    assert.match(childrenRouteSource, /prisma\.child\.count\(\{\s*where:\s*\{\s*userId\s*\}\s*\}\)/);
    assert.match(childrenRouteSource, /const\s+limit\s*=\s*childLimitDecision\.limit/);
    assert.match(childrenRouteSource, /if\s*\(\s*currentCount\s*>=\s*limit\s*\)/);
  });

  it("children route keeps 403 response shape fields: success, error, limit, current", () => {
    assert.match(
      childrenRouteSource,
      /res\.status\(403\)\.json\(\{\s*success:\s*false,\s*error:\s*"Child limit reached for your plan",\s*limit,\s*current:\s*currentCount,\s*\}\)/,
    );
  });

  it("payments route keeps User.plan projection writes through billing helpers", () => {
    assert.match(paymentsRouteSource, /resolvePlanFromLemonVariantId/);
    assert.match(paymentsRouteSource, /resolveEffectiveUserPlanForSubscription/);
    assert.match(paymentsRouteSource, /data:\s*\{\s*plan:\s*"FREE"\s*\}/);
    assert.match(paymentsRouteSource, /data:\s*\{\s*plan:\s*effectiveUserPlan,/);
  });

  it("access-check policy files do not contain provider-specific id policy logic", () => {
    const providerIdPolicyTokens =
      /variantId|variant_id|productId|product_id|LEMON_VARIANT|stripePriceId|PAYMENT_ACTIVE_PROVIDER/;
    assert.equal(providerIdPolicyTokens.test(plansMiddlewareSource), false);
    assert.equal(providerIdPolicyTokens.test(storiesRouteSource), false);
    assert.equal(providerIdPolicyTokens.test(childrenRouteSource), false);
  });

  it("static guardrails preserve current story limits and entitlement child-limit mapping", () => {
    assert.match(plansMiddlewareSource, /const\s+FREE_MONTHLY_LIMIT\s*=\s*3\s*;/);
    assert.match(serviceSource, /if\s*\(\s*plan\s*===\s*"FAMILY"\s*\)\s*return\s*4/);
    assert.match(
      serviceSource,
      /if\s*\(\s*plan\s*===\s*"SCHOOL"\s*\)\s*return\s*Number\.POSITIVE_INFINITY/,
    );
    assert.match(serviceSource, /return\s*1/);
  });
});
