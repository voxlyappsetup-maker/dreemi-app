/**
 * Public pricing amounts aligned with FastSpring catalog (test/trial).
 * @see docs/D3M_FASTSPRING_CATALOG_PLAN.md
 */
export const FASTSPRING_ALIGNED_PRICES = {
  individual: {
    monthly: "$4.99",
    yearly: "$47.90",
  },
  family: {
    monthly: "$9.99",
    yearly: "$95.90",
  },
  free: {
    monthly: "$0",
    yearly: "$0",
  },
} as const;

/** School is deferred — not in FastSpring launch catalog. */
export const SCHOOL_PLAN_DEFERRED = true;
