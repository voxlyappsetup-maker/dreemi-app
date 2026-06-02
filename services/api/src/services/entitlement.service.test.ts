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

  it("routes and middleware do not import entitlement.service.ts in this phase", () => {
    const pattern = /entitlement\.service|EntitlementService|getEffectiveEntitlement/;
    assert.equal(pattern.test(paymentsRouteSource), false);
    assert.equal(pattern.test(childrenRouteSource), false);
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
