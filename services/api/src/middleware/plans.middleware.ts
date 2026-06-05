import { Request, Response, NextFunction } from "express";
import { prisma } from "../services/prisma.service";
import { createEntitlementService } from "../services/entitlement.service";

const FREE_MONTHLY_LIMIT = 3;
const entitlementService = createEntitlementService();

/**
 * Enforce story generation limits based on user plan.
 * FREE → max 3 stories/month. INDIVIDUAL / FAMILY / SCHOOL → unlimited.
 * Must run **after** `authenticateToken` so `req.userId` is set.
 */
export async function checkStoryLimit(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: "رمز الوصول مطلوب" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true },
    });

    if (!user) {
      res.status(404).json({ success: false, error: "المستخدم غير موجود" });
      return;
    }

    const accessPlan = await entitlementService.getPlanForAccessCheck(userId, user.plan);
    if (accessPlan !== "FREE") {
      next();
      return;
    }

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const count = await prisma.story.count({
      where: {
        userId,
        createdAt: { gte: monthStart },
      },
    });

    if (count >= FREE_MONTHLY_LIMIT) {
      res.status(403).json({
        success: false,
        error: `وصلت للحد الأقصى (${FREE_MONTHLY_LIMIT} قصص/شهر). قم بالترقية لقصص غير محدودة.`,
        code: "STORY_LIMIT_REACHED",
      });
      return;
    }

    next();
  } catch (err) {
    console.error("[Plans] checkStoryLimit error:", err);
    res.status(500).json({ success: false, error: "خطأ في التحقق من الخطة" });
  }
}
