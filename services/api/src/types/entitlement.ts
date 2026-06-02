export type EntitlementPlan = "FREE" | "INDIVIDUAL" | "FAMILY" | "SCHOOL";

export type EntitlementStatus =
  | "none"
  | "active"
  | "trialing"
  | "grace_period"
  | "past_due"
  | "billing_issue"
  | "active_until_expiry"
  | "paused"
  | "expired"
  | "canceled"
  | "revoked"
  | "unknown";

export type EntitlementSourceType =
  | "USER_PLAN_COMPATIBILITY"
  | "LEMON_WEB_LEGACY"
  | "APPLE_APP_STORE"
  | "GOOGLE_PLAY"
  | "FUTURE_WEB_PROVIDER"
  | "MANUAL_INTERNAL";

export interface EffectiveEntitlement {
  userId: string;
  plan: EntitlementPlan;
  status: EntitlementStatus;
  sourceType: EntitlementSourceType;
  sourceRecordId: string | null;
  validFrom: string | null;
  validUntil: string | null;
  computedAt: string;
  grantsPaidAccess: boolean;
  reason: string;
  safeErrorCode: string | null;
  projectedUserPlan: EntitlementPlan;
}
