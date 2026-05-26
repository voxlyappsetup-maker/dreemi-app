import { Router, Request, Response } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { Plan, User } from "@prisma/client";
import { prisma } from "../services/prisma.service";
import {
  signTokenPair,
  verifyRefreshToken,
} from "../services/jwt.service";
import { authenticateToken } from "../middleware/auth.middleware";
import { stripe } from "../services/stripe.service";

export const authRouter = Router();

const BCRYPT_ROUNDS = 12;
const INVALID_CREDENTIALS_MSG =
  "البريد الإلكتروني أو كلمة المرور غير صحيحة";

const languageSchema = z.enum(["ar", "en", "fr"], {
  errorMap: () => ({ message: "اللغة يجب أن تكون ar أو en أو fr" }),
});

const registerSchema = z.object({
  email: z
    .string({ required_error: "البريد الإلكتروني مطلوب" })
    .email("البريد الإلكتروني غير صالح"),
  password: z
    .string({ required_error: "كلمة المرور مطلوبة" })
    .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
  name: z
    .string({ required_error: "الاسم مطلوب" })
    .min(1, "الاسم مطلوب")
    .max(100, "الاسم طويل جداً"),
  language: languageSchema,
});

const loginSchema = z.object({
  email: z
    .string({ required_error: "البريد الإلكتروني مطلوب" })
    .email("البريد الإلكتروني غير صالح"),
  password: z.string({ required_error: "كلمة المرور مطلوبة" }),
});

const refreshSchema = z.object({
  refreshToken: z.string({ required_error: "رمز التحديث مطلوب" }).min(1),
});

type PublicUser = {
  id: string;
  email: string;
  name: string | null;
  language: string;
  plan: Plan;
  createdAt: Date;
  updatedAt: Date;
};

function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    language: user.language,
    plan: user.plan,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function formatZodError(error: z.ZodError): string {
  return error.errors.map((e) => e.message).join("، ");
}

authRouter.post("/register", async (req: Request, res: Response) => {
  try {
    const input = registerSchema.parse(req.body);

    const existing = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });
    if (existing) {
      res.status(409).json({
        success: false,
        error: "البريد الإلكتروني مستخدم بالفعل",
      });
      return;
    }

    const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);
    const user = await prisma.user.create({
      data: {
        email: input.email.toLowerCase(),
        passwordHash,
        name: input.name,
        language: input.language,
      },
    });

    const { accessToken, refreshToken } = signTokenPair(user.id);

    res.status(201).json({
      success: true,
      user: toPublicUser(user),
      accessToken,
      refreshToken,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, error: formatZodError(error) });
      return;
    }
    if (
      error instanceof Error &&
      (error.message.includes("JWT_SECRET") ||
        error.message.includes("JWT_REFRESH_SECRET"))
    ) {
      res.status(500).json({ success: false, error: "خطأ في إعداد الخادم" });
      return;
    }
    res.status(500).json({ success: false, error: "فشل إنشاء الحساب" });
  }
});

authRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const input = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    if (!user?.passwordHash) {
      res.status(401).json({
        success: false,
        error: INVALID_CREDENTIALS_MSG,
      });
      return;
    }

    const valid = await bcrypt.compare(input.password, user.passwordHash);
    if (!valid) {
      res.status(401).json({
        success: false,
        error: INVALID_CREDENTIALS_MSG,
      });
      return;
    }

    const { accessToken, refreshToken } = signTokenPair(user.id);

    res.json({
      success: true,
      user: toPublicUser(user),
      accessToken,
      refreshToken,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, error: formatZodError(error) });
      return;
    }
    if (
      error instanceof Error &&
      (error.message.includes("JWT_SECRET") ||
        error.message.includes("JWT_REFRESH_SECRET"))
    ) {
      res.status(500).json({ success: false, error: "خطأ في إعداد الخادم" });
      return;
    }
    res.status(500).json({ success: false, error: "فشل تسجيل الدخول" });
  }
});

authRouter.post("/refresh", async (req: Request, res: Response) => {
  try {
    const input = refreshSchema.parse(req.body);

    let userId: string;
    try {
      ({ userId } = verifyRefreshToken(input.refreshToken));
    } catch {
      res.status(401).json({
        success: false,
        error: "رمز التحديث غير صالح أو منتهي الصلاحية",
      });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(401).json({
        success: false,
        error: "رمز التحديث غير صالح أو منتهي الصلاحية",
      });
      return;
    }

    const { accessToken, refreshToken } = signTokenPair(user.id);

    res.json({
      success: true,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, error: formatZodError(error) });
      return;
    }
    if (
      error instanceof Error &&
      (error.message.includes("JWT_SECRET") ||
        error.message.includes("JWT_REFRESH_SECRET"))
    ) {
      res.status(500).json({ success: false, error: "خطأ في إعداد الخادم" });
      return;
    }
    res.status(500).json({ success: false, error: "فشل تحديث الرمز" });
  }
});

authRouter.get("/me", authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!user) {
      res.status(404).json({ success: false, error: "المستخدم غير موجود" });
      return;
    }

    res.json({ success: true, user: toPublicUser(user) });
  } catch {
    res.status(500).json({ success: false, error: "فشل جلب بيانات المستخدم" });
  }
});

/* ------------------------------------------------------------------ */
/*  GET /api/auth/export-data  (GDPR Article 20 — data portability)   */
/* ------------------------------------------------------------------ */

authRouter.get("/export-data", authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: {
        stories: { orderBy: { createdAt: "desc" } },
        subscription: true,
        children: true,
      },
    });

    if (!user) {
      res.status(404).json({ success: false, error: "المستخدم غير موجود" });
      return;
    }

    const exportData = {
      exportDate: new Date().toISOString(),
      profile: {
        id: user.id,
        email: user.email,
        name: user.name,
        language: user.language,
        plan: user.plan,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      children: user.children.map((c) => ({
        id: c.id,
        name: c.name,
        age: c.age,
        createdAt: c.createdAt,
      })),
      stories: user.stories.map((s) => ({
        id: s.id,
        title: s.title,
        content: s.content,
        language: s.language,
        theme: s.theme,
        moral: s.moral,
        childName: s.childName,
        childAge: s.childAge,
        isFavorite: s.isFavorite,
        createdAt: s.createdAt,
      })),
      subscription: user.subscription
        ? {
            plan: user.subscription.plan,
            status: user.subscription.status,
            currentPeriodStart: user.subscription.currentPeriodStart,
            currentPeriodEnd: user.subscription.currentPeriodEnd,
            cancelAtPeriodEnd: user.subscription.cancelAtPeriodEnd,
          }
        : null,
    };

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", 'attachment; filename="dreemi-data-export.json"');
    res.send(JSON.stringify(exportData, null, 2));
  } catch (err) {
    console.error("[Auth] export-data error:", err);
    res.status(500).json({ success: false, error: "فشل تصدير البيانات" });
  }
});

/* ------------------------------------------------------------------ */
/*  DELETE /api/auth/delete-account  (GDPR Article 17 — right to erasure) */
/* ------------------------------------------------------------------ */

const deleteSchema = z.object({
  confirm: z.literal("DELETE", {
    errorMap: () => ({ message: 'يجب كتابة "DELETE" للتأكيد' }),
  }),
});

authRouter.delete("/delete-account", authenticateToken, async (req: Request, res: Response) => {
  try {
    deleteSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { subscription: true },
    });

    if (!user) {
      res.status(404).json({ success: false, error: "المستخدم غير موجود" });
      return;
    }

    // Cancel active Stripe subscription if exists
    if (user.subscription?.stripeSubscriptionId) {
      try {
        await stripe.subscriptions.cancel(user.subscription.stripeSubscriptionId);
        console.log(`[Auth] cancelled Stripe sub ${user.subscription.stripeSubscriptionId}`);
      } catch (err) {
        console.warn("[Auth] failed to cancel Stripe subscription:", err);
      }
    }

    // Prisma cascades will delete stories, children, and subscription
    await prisma.user.delete({ where: { id: req.userId } });

    console.log(`[Auth] ✓ account deleted: user=${req.userId} email=${user.email}`);
    res.json({ success: true, message: "Account deleted" });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, error: formatZodError(err) });
      return;
    }
    console.error("[Auth] delete-account error:", err);
    res.status(500).json({ success: false, error: "فشل حذف الحساب" });
  }
});
