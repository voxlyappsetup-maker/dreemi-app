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
const serviceSource = fs.readFileSync(SERVICE_PATH, "utf-8");
const paymentsRouteSource = fs.readFileSync(PAYMENTS_ROUTE_PATH, "utf-8");
const childrenRouteSource = fs.readFileSync(CHILDREN_ROUTE_PATH, "utf-8");
const storiesRouteSource = fs.readFileSync(STORIES_ROUTE_PATH, "utf-8");
const plansMiddlewareSource = fs.readFileSync(PLANS_MIDDLEWARE_PATH, "utf-8");

describe("EntitlementService skeleton default behavior", () => {
  it("default effective entitlement returns FREE", async () => {
    const service = createEntitlementService();
    const effective = await service.getEffectiveEntitlement("user_123");
    assert.equal(effective.plan, "FREE");
  });

  it("default grantsPaidAccess is false", async () => {
    const service = createEntitlementService();
    const effective = await service.getEffectiveEntitlement("user_123");
    assert.equal(effective.grantsPaidAccess, false);
  });

  it("projectedUserPlan is FREE", async () => {
    const service = createEntitlementService();
    const effective = await service.getEffectiveEntitlement("user_123");
    assert.equal(effective.projectedUserPlan, "FREE");
  });

  it("sourceType is USER_PLAN_COMPATIBILITY", async () => {
    const service = createEntitlementService();
    const effective = await service.getEffectiveEntitlement("user_123");
    assert.equal(effective.sourceType, "USER_PLAN_COMPATIBILITY");
  });

  it("getPlanForAccessCheck returns FREE", async () => {
    const service = createEntitlementService();
    const plan = await service.getPlanForAccessCheck("user_123");
    assert.equal(plan, "FREE");
  });

  it("getChildLimit returns 1", async () => {
    const service = createEntitlementService();
    const decision = await service.getChildLimit("user_123");
    assert.equal(decision.limit, 1);
    assert.equal(decision.plan, "FREE");
  });

  it("project helper does not write to DB and returns projected plan only", async () => {
    const service = createEntitlementService();
    const effective = await service.getEffectiveEntitlement("user_123");
    const projection = service.projectEffectivePlanToUser("user_123", effective);
    assert.equal(projection.projectedPlan, "FREE");
    assert.equal(projection.wroteToUserPlan, false);
  });

  it("no provider-specific product IDs are needed to compute access", async () => {
    const service = createEntitlementService();
    const effective = await service.getEffectiveEntitlement("user_123");
    assert.equal(typeof effective.plan, "string");
    assert.equal(effective.plan, "FREE");
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
    assert.equal(serviceSource.includes("prisma.service"), false);
    assert.equal(serviceSource.includes("@prisma/client"), false);
  });

  it("service file does not read process.env", () => {
    assert.equal(serviceSource.includes("process.env"), false);
  });

  it("routes and middleware do not import entitlement.service.ts in this phase", () => {
    const pattern = /entitlement\.service|EntitlementService|getEffectiveEntitlement/;
    assert.equal(pattern.test(paymentsRouteSource), false);
    assert.equal(pattern.test(childrenRouteSource), false);
    assert.equal(pattern.test(storiesRouteSource), false);
    assert.equal(pattern.test(plansMiddlewareSource), false);
  });
});
