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

  async getEffectiveEntitlement(userId: string): Promise<EffectiveEntitlement> {
    const normalizedUserId = this.validateUserId(userId);
    if (!normalizedUserId) {
      return createFreeEffectiveEntitlement({
        userId: "unknown",
        reason: "fail_closed_invalid_user_id",
        safeErrorCode: "INVALID_USER_ID",
      });
    }

    return createFreeEffectiveEntitlement({
      userId: normalizedUserId,
      reason: "skeleton_default_free",
      safeErrorCode: null,
    });
  }

  async getPlanForAccessCheck(userId: string): Promise<EntitlementPlan> {
    const entitlement = await this.getEffectiveEntitlement(userId);
    return entitlement.projectedUserPlan;
  }

  async canGenerateStory(userId: string): Promise<StoryAccessDecision> {
    const normalizedUserId = this.validateUserId(userId);
    if (!normalizedUserId) {
      return {
        allowed: false,
        plan: "FREE",
        reason: "fail_closed_invalid_user_id",
        safeErrorCode: "INVALID_USER_ID",
      };
    }

    return {
      allowed: true,
      plan: "FREE",
      reason: "free_policy_no_behavior_change",
      safeErrorCode: null,
    };
  }

  async getChildLimit(userId: string): Promise<ChildLimitDecision> {
    const normalizedUserId = this.validateUserId(userId);
    if (!normalizedUserId) {
      return {
        limit: 1,
        plan: "FREE",
        reason: "fail_closed_invalid_user_id",
        safeErrorCode: "INVALID_USER_ID",
      };
    }

    return {
      limit: 1,
      plan: "FREE",
      reason: "free_policy_no_behavior_change",
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
