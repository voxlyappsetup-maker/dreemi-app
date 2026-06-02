import type { EffectiveEntitlement, EntitlementPlan } from "../types/entitlement";

type CreateFreeEffectiveEntitlementInput = {
  userId: string;
  reason: string;
  safeErrorCode?: string | null;
};

export function createFreeEffectiveEntitlement(
  input: CreateFreeEffectiveEntitlementInput,
): EffectiveEntitlement {
  return {
    userId: input.userId,
    plan: "FREE",
    status: "unknown",
    sourceType: "USER_PLAN_COMPATIBILITY",
    sourceRecordId: null,
    validFrom: null,
    validUntil: null,
    computedAt: new Date().toISOString(),
    grantsPaidAccess: false,
    reason: input.reason,
    safeErrorCode: input.safeErrorCode ?? null,
    projectedUserPlan: "FREE",
  };
}

type EntitlementServiceErrorCode = "INVALID_USER_ID";
type UserPlanCompatibilityInput = EntitlementPlan | string | null | undefined;

type StoryAccessDecision = {
  allowed: boolean;
  plan: EntitlementPlan;
  reason: string;
  safeErrorCode: EntitlementServiceErrorCode | null;
};

type ChildLimitDecision = {
  limit: number;
  plan: EntitlementPlan;
  reason: string;
  safeErrorCode: EntitlementServiceErrorCode | null;
};

type ProjectionResult = {
  userId: string;
  projectedPlan: EntitlementPlan;
  wroteToUserPlan: false;
  reason: string;
  safeErrorCode: EntitlementServiceErrorCode | null;
};

export class EntitlementService {
  private validateUserId(userId: string): string | null {
    const normalized = String(userId ?? "").trim();
    return normalized.length > 0 ? normalized : null;
  }

  private resolvePlanFromUserPlan(userPlan: UserPlanCompatibilityInput): EntitlementPlan {
    const normalizedPlan = String(userPlan ?? "").trim().toUpperCase();
    if (normalizedPlan === "INDIVIDUAL") return "INDIVIDUAL";
    if (normalizedPlan === "FAMILY") return "FAMILY";
    if (normalizedPlan === "SCHOOL") return "SCHOOL";
    if (normalizedPlan === "FREE") return "FREE";
    return "FREE";
  }

  private resolveStatusFromPlan(plan: EntitlementPlan): EffectiveEntitlement["status"] {
    return plan === "FREE" ? "none" : "active";
  }

  private resolveReasonFromUserPlan(
    userPlan: UserPlanCompatibilityInput,
    resolvedPlan: EntitlementPlan,
  ): string {
    const normalizedPlan = String(userPlan ?? "").trim().toUpperCase();
    if (normalizedPlan.length === 0) {
      return "user_plan_missing_fail_closed_free";
    }
    if (normalizedPlan !== resolvedPlan) {
      return "user_plan_unsupported_fail_closed_free";
    }
    return "user_plan_compatibility_projection";
  }

  private createEffectiveEntitlementFromResolvedPlan(
    userId: string,
    plan: EntitlementPlan,
    reason: string,
  ): EffectiveEntitlement {
    return {
      userId,
      plan,
      status: this.resolveStatusFromPlan(plan),
      sourceType: "USER_PLAN_COMPATIBILITY",
      sourceRecordId: null,
      validFrom: null,
      validUntil: null,
      computedAt: new Date().toISOString(),
      grantsPaidAccess: plan !== "FREE",
      reason,
      safeErrorCode: null,
      projectedUserPlan: plan,
    };
  }

  private resolveChildLimitFromPlan(plan: EntitlementPlan): number {
    if (plan === "FAMILY") return 4;
    if (plan === "SCHOOL") return Number.POSITIVE_INFINITY;
    return 1;
  }

  getEffectiveEntitlementFromUserPlan(
    userId: string,
    userPlan: UserPlanCompatibilityInput,
  ): EffectiveEntitlement {
    const normalizedUserId = this.validateUserId(userId);
    if (!normalizedUserId) {
      return createFreeEffectiveEntitlement({
        userId: "unknown",
        reason: "fail_closed_invalid_user_id",
        safeErrorCode: "INVALID_USER_ID",
      });
    }

    const resolvedPlan = this.resolvePlanFromUserPlan(userPlan);
    const reason = this.resolveReasonFromUserPlan(userPlan, resolvedPlan);
    return this.createEffectiveEntitlementFromResolvedPlan(
      normalizedUserId,
      resolvedPlan,
      reason,
    );
  }

  async getEffectiveEntitlement(
    userId: string,
    userPlan?: UserPlanCompatibilityInput,
  ): Promise<EffectiveEntitlement> {
    const normalizedUserId = this.validateUserId(userId);
    if (!normalizedUserId) {
      return createFreeEffectiveEntitlement({
        userId: "unknown",
        reason: "fail_closed_invalid_user_id",
        safeErrorCode: "INVALID_USER_ID",
      });
    }

    const resolvedPlan = this.resolvePlanFromUserPlan(userPlan);
    const reason = this.resolveReasonFromUserPlan(userPlan, resolvedPlan);
    return this.createEffectiveEntitlementFromResolvedPlan(normalizedUserId, resolvedPlan, reason);
  }

  async getPlanForAccessCheck(
    userId: string,
    userPlan?: UserPlanCompatibilityInput,
  ): Promise<EntitlementPlan> {
    const entitlement = await this.getEffectiveEntitlement(userId, userPlan);
    return entitlement.projectedUserPlan;
  }

  async canGenerateStory(
    userId: string,
    userPlan?: UserPlanCompatibilityInput,
  ): Promise<StoryAccessDecision> {
    const normalizedUserId = this.validateUserId(userId);
    if (!normalizedUserId) {
      return {
        allowed: false,
        plan: "FREE",
        reason: "fail_closed_invalid_user_id",
        safeErrorCode: "INVALID_USER_ID",
      };
    }

    const entitlement = await this.getEffectiveEntitlement(normalizedUserId, userPlan);
    return {
      allowed: true,
      plan: entitlement.projectedUserPlan,
      reason: "user_plan_compatibility_access_check",
      safeErrorCode: null,
    };
  }

  async getChildLimit(
    userId: string,
    userPlan?: UserPlanCompatibilityInput,
  ): Promise<ChildLimitDecision> {
    const normalizedUserId = this.validateUserId(userId);
    if (!normalizedUserId) {
      return {
        limit: 1,
        plan: "FREE",
        reason: "fail_closed_invalid_user_id",
        safeErrorCode: "INVALID_USER_ID",
      };
    }

    const entitlement = await this.getEffectiveEntitlement(normalizedUserId, userPlan);
    return {
      limit: this.resolveChildLimitFromPlan(entitlement.projectedUserPlan),
      plan: entitlement.projectedUserPlan,
      reason: "user_plan_compatibility_child_limit",
      safeErrorCode: null,
    };
  }

  projectEffectivePlanToUser(userId: string, effective: EffectiveEntitlement): ProjectionResult {
    const normalizedUserId = this.validateUserId(userId);
    if (!normalizedUserId) {
      return {
        userId: "unknown",
        projectedPlan: "FREE",
        wroteToUserPlan: false,
        reason: "fail_closed_invalid_user_id",
        safeErrorCode: "INVALID_USER_ID",
      };
    }

    return {
      userId: normalizedUserId,
      projectedPlan: effective.projectedUserPlan ?? "FREE",
      wroteToUserPlan: false,
      reason: "skeleton_projection_no_write",
      safeErrorCode: null,
    };
  }
}

export function createEntitlementService(): EntitlementService {
  return new EntitlementService();
}
